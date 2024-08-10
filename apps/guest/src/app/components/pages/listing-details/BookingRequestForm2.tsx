import { Grid } from '@mui/material';
import {
  AcceptedLeaseType,
  Asset,
  BookingDetails,
  Company,
} from '@offisito-shared';
import { TODO, format } from '@base-shared';
import {
  ActionModal,
  axiosErrorToaster,
  renderDatePicker,
  renderDropdown,
  renderSwitch,
  renderTextField,
  ServerContext,
} from '@base-frontend';
import debounce from 'lodash.debounce';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { Btn, PrimaryText } from '@offisito-frontend';

export const BookingRequestForm2 = ({ asset, readOnly, close }: TODO) => {
  const [formState, setFormState] = useState<BookingDetails>();
  const [sendModal, setSendModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const isBookingInitiatedRef = useRef(false);
  const server = useContext(ServerContext);

  // TODO: in the app, "start data" and "end date" are already showing current local date, HOWEVER, simply clicking "send this draft to host",
  //  will NOT update startDate and endDate keys in the database, as they are not in the formState object.
  //  you will need to MANUALLY pick the current data again, which will update the formstate and consequently the database draft, AND THEN send it to the host.

  const initNewBooking = useCallback(
    async (asset: Asset) => {
      isBookingInitiatedRef.current = true;
      const resFound = await server?.axiosInstance.get(
        `api/bookings/draftsByAssetId/${String(asset._id)}`,
      );
      if (resFound?.data?.length > 0) {
        setFormState(resFound?.data[0]);
        toast.success('Draft recovered');
      } else {
        const resID = await server?.axiosInstance.post(
          `api/bookings/${String(asset._id)}`,
        );
        // TODO: what is resID.data ?
        resID?.data &&
          setFormState(
            (
              await server?.axiosInstance.get(
                'api/bookings/draftsByBookingId/' + resID.data,
              )
            )?.data[0],
          );
      }
    },
    [server?.axiosInstance],
  );

  useEffect(() => {
    if (!isBookingInitiatedRef.current && asset) initNewBooking(asset);
  }, [asset, isBookingInitiatedRef, initNewBooking]);

  const updateNestedObject = (obj: TODO, path: string[], value: TODO): TODO => {
    if (path.length === 1) {
      obj[path[0]] = value;
      return obj;
    } else {
      if (obj[path[0]] === undefined || typeof obj[path[0]] !== 'object') {
        obj[path[0]] = {};
      }
      obj[path[0]] = updateNestedObject(obj[path[0]], path.slice(1), value);
      return obj;
    }
  };

  const handleUpdate = useCallback(
    async (updatedState: Company) => {
      try {
        const res = await server?.axiosInstance.put(
          `/api/bookings/${String(updatedState._id)}`,
          updatedState,
        );
        toast.success(res?.data);
      } catch (error) {
        axiosErrorToaster(error);
      }
    },
    [server?.axiosInstance],
  );

  const debouncedUpdate =
    !readOnly && useMemo(() => debounce(handleUpdate, 500), [handleUpdate]);

  const handleChange = (
    path: string[] | keyof BookingDetails,
    value: string | Date | boolean,
  ) => {
    if (!formState) return;
    const updatedFormState = updateNestedObject(
      { ...formState },
      path[0].length > 0 ? (path as string[]) : [path as keyof BookingDetails],
      value,
    );
    debouncedUpdate && debouncedUpdate(updatedFormState)?.then();
    !readOnly && setFormState(updatedFormState);
  };

  const handleChangePrimitive = (
    name: string,
    value: string | Date | boolean,
  ) => {
    formState &&
      setFormState(((prevState: Company) => {
        const updatedState: Partial<Company> = { ...prevState, [name]: value };
        debouncedUpdate && debouncedUpdate(updatedState as Company)?.then();
        return updatedState;
      }) as TODO);
  };

  const renderDay = (key: string, label: string, readOnly?: boolean) =>
    renderSwitch(formState, handleChange, ['daysInWeek', key], {
      label: { truthy: label },
      disable: readOnly,
    });

  return (
    <Grid
      height="80%"
      width="80%"
      marginLeft="10%"
      marginTop="5%"
      padding="2%"
      overflow="scroll"
      item
      container
      direction="column"
      rowSpacing={4}
      alignItems="center"
      wrap="nowrap"
      bgcolor={(theme) => theme.palette.background.default}
    >
      {formState ? (
        <>
          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            columnSpacing={1}
          >
            <Grid item>{renderDay('sun', 'Sunday', readOnly)}</Grid>
            <Grid item>{renderDay('mon', 'Monday', readOnly)}</Grid>
            <Grid item>{renderDay('tues', 'Tuesdy', readOnly)}</Grid>
            <Grid item>{renderDay('wed', 'Wednesday', readOnly)}</Grid>
            <Grid item>{renderDay('thu', 'Thursday', readOnly)}</Grid>
            <Grid item>{renderDay('fri', 'Friday', readOnly)}</Grid>
            <Grid item>{renderDay('sat', 'Saturday', readOnly)}</Grid>
          </Grid>
          <Grid item>
            {renderDatePicker(
              formState,
              handleChangePrimitive,
              'startDate',
              'Start Date: ',
              readOnly,
            )}
          </Grid>
          <Grid item>
            {renderDatePicker(
              formState,
              handleChangePrimitive,
              'endDate',
              'End Date: ',
              readOnly,
            )}
          </Grid>
          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            columnSpacing={2}
          >
            <Grid item>
              <PrimaryText>Lease Type: </PrimaryText>
            </Grid>
            <Grid item>
              {renderDropdown(
                formState,
                handleChange,
                ['leaseType'],
                'Lease Type: ',
                Object.values(AcceptedLeaseType).map((value) => ({
                  value,
                  label: value,
                })),
                readOnly,
              )}
            </Grid>
          </Grid>
          <Grid item>
            {renderTextField(formState, handleChange, ['contractLength'], {
              number: true,
              label: format('contractLength') + ' in months',
              disabled: readOnly,
            })}
          </Grid>
          <Grid item>
            {renderTextField(formState, handleChange, ['note'], {
              multiline: true,
              disabled: readOnly,
            })}
          </Grid>
          {sendModal && (
            <ActionModal
              closeModal={() => setSendModal(false)}
              endpoint={`api/bookings/sendOffer/${String(formState._id)}`}
              name="Send to Host"
              doingName="sending to host"
              method="post"
              cb={() => {
                close();
                /*  asset?.companyId &&
                    sendMessage(
                       server?.axiosInstance,
                       asset.companyId.toString(),
                       NEW_BOOKING_MESSAGE,
                     );*/
              }}
            />
          )}
          {readOnly ? (
            <>
              <Grid item>
                <Btn
                  onClick={() => {
                    setSendModal(true);
                  }}
                >
                  Approve
                </Btn>
              </Grid>
              {deleteModal && (
                <ActionModal
                  closeModal={() => setDeleteModal(false)}
                  endpoint={`api/bookings/${String(formState._id)}`}
                  name="Delete"
                  doingName="deleting"
                  method="delete"
                  cb={close}
                />
              )}
              <Grid item>
                <Btn color="error" onClick={() => setDeleteModal(true)}>
                  Deny
                </Btn>
              </Grid>
            </>
          ) : (
            <>
              <Grid item>
                <Btn
                  onClick={() => {
                    setSendModal(true);
                  }}
                >
                  Send this Draft to Host
                </Btn>
              </Grid>
              {deleteModal && (
                <ActionModal
                  closeModal={() => setDeleteModal(false)}
                  endpoint={`api/bookings/${String(formState._id)}`}
                  name="Delete"
                  doingName="deleting"
                  method="delete"
                  cb={close}
                />
              )}
              <Grid item>
                <Btn color="error" onClick={() => setDeleteModal(true)}>
                  Delete this Draft
                </Btn>
              </Grid>
            </>
          )}
        </>
      ) : (
        <Grid item>
          <PrimaryText>Loading form...</PrimaryText>
        </Grid>
      )}
    </Grid>
  );
};
