import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';
import { Grid, MenuItem, Select } from '@mui/material';
import {
  axiosErrorToaster,
  renderDropdown,
  renderSwitchGroup,
  renderTextField,
  ServerContext,
} from '@base-frontend';
import {
  AcceptedLeaseType,
  Asset,
  Status,
  AssetType,
  Company,
  Floor,
  StartAssetReq,
  AccessedAmenity,
  AmenityType,
  AmenityAccess,
} from '@offisito-shared';
import PicturesModal from './PicturesModal';
import {
  Btn,
  CloseAndSave,
  ListingsContext,
  PrimaryText,
} from '@offisito-frontend';
import { format, TODO } from '@base-shared';

interface SpaceFormProps {
  id?: string;
  closeModal?: () => void;
}

const SpaceForm = ({ id, closeModal }: SpaceFormProps) => {
  const [picturesModal, setPicturesModal] = useState(false);
  const [formState, setFormState] = useState<Asset>();
  const server = useContext(ServerContext);
  const { myProfiles, amenities } = useContext(ListingsContext);

  const [signal, signalSend] = useState(false);

  useEffect(() => {
    signal && formState && handleUpdate(formState);
  }, [signal]);

  const fetchSpace = useCallback(
    async (id: string) => {
      try {
        const res = await server?.axiosInstance.get(
          `/api/host/assets/asset_detail/${id}`,
        );
        setFormState(res?.data);
      } catch (e) {
        axiosErrorToaster(e);
      }
    },
    [server?.axiosInstance],
  );

  const creationInitiatedRef = useRef(false);

  const createNew = useCallback(async () => {
    if (!creationInitiatedRef.current && myProfiles) {
      creationInitiatedRef.current = true;
      try {
        const res = await server?.axiosInstance.post<TODO, TODO, StartAssetReq>(
          'api/host/assets/get_asset_id',
          { companyId: myProfiles[0]._id },
        );
        const newAssetId = res?.data?._id.toString();
        return newAssetId;
      } catch (e) {
        axiosErrorToaster(e);
      }
    } else if (!myProfiles) {
      toast.error('Create your first profile first');
    }
  }, [myProfiles, server?.axiosInstance]);

  const { search } = useLocation();

  useEffect(() => {
    const init = async () => {
      const queryId = new URLSearchParams(search).get('id');
      const effectiveId = id || queryId;
      if (!effectiveId) {
        const newId = await createNew();
        if (newId) fetchSpace(newId);
      } else {
        fetchSpace(effectiveId);
      }
    };
    init();
  }, [createNew, fetchSpace, id, search]);

  const handleUpdate = useCallback(
    async (updatedState: Asset) => {
      try {
        const res = await server?.axiosInstance.put(
          `/api/host/assets/edit_asset/${updatedState._id}`,
          updatedState,
        );
        toast.success(res?.data.msg);
      } catch (error) {
        axiosErrorToaster(error);
      } finally {
        signalSend(false);
      }
    },
    [server?.axiosInstance],
  );

  useEffect(() => {
    console.log('asdasdasqd ', formState?.assetAmenities);
  }, [formState]);

  const debouncedUpdate = useMemo(
    () => debounce(handleUpdate, 500),
    [handleUpdate],
  );

  const handleChange = (
    path: keyof Asset | string[],
    value: string | Date | boolean,
  ) => {
    if (formState) {
      setFormState((prevState: Asset | undefined) => {
        const updateNestedObject = (
          obj: TODO,
          pathArray: string[],
          value: TODO,
        ): TODO => {
          const [first, ...rest] = pathArray;
          if (rest.length === 0) {
            obj[first] = value;
          } else {
            if (!obj[first]) obj[first] = {};
            updateNestedObject(obj[first], rest, value);
          }
          return obj;
        };

        const pathArray = Array.isArray(path) ? path : [path];

        const updatedState = updateNestedObject(
          prevState ? { ...prevState } : {},
          pathArray,
          value,
        );

        debouncedUpdate(updatedState as Asset)?.then();

        return updatedState;
      });
    }
  };

  return (
    <>
      {picturesModal && (
        <PicturesModal
          setPicturesModal={setPicturesModal}
          fetchSpace={fetchSpace}
          formState={formState}
        />
      )}
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
        <Grid item>
          <CloseAndSave onClick={() => closeModal && closeModal()} />
        </Grid>
        {formState?._id ? (
          <>
            <Grid item>
              <PrimaryText variant="h4">List your Space</PrimaryText>
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={2}
            >
              <Grid item>
                <PrimaryText>Profile: </PrimaryText>
              </Grid>
              {myProfiles && (
                <Grid item>
                  {renderDropdown(
                    formState,
                    handleChange,
                    'companyId',
                    format('leasingCompany'),
                    myProfiles.map(({ _id, companyName }) => ({
                      value: String(_id.toString()),
                      label: companyName,
                    })),
                  )}
                </Grid>
              )}
            </Grid>
            <Grid item>
              {renderTextField(formState, handleChange, 'assetDescription', {
                label: 'Description',
                multiline: true,
              })}
            </Grid>
            <Grid item>
              {renderTextField(formState, handleChange, 'roomNumber')}
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={2}
            >
              <Grid item>
                <PrimaryText>Space Type: </PrimaryText>
              </Grid>
              <Grid item>
                {renderDropdown(
                  formState,
                  handleChange,
                  'assetType',
                  format('assetType'),
                  Object.values(AssetType).map((value) => ({
                    value,
                    label: format(value),
                  })),
                )}
              </Grid>
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={2}
            >
              <Grid item>
                <PrimaryText>Floor Number: </PrimaryText>
              </Grid>
              {myProfiles && formState && (
                <Grid item>
                  {renderDropdown(
                    formState,
                    handleChange,
                    'floorNumber',
                    format('floorNumber'),
                    myProfiles
                      .find(
                        ({ _id }: Company) =>
                          String(_id.toString()) ===
                          formState?.companyId.toString(),
                      )
                      ?.floor?.map(({ floorNumber }: Floor) => ({
                        value: floorNumber,
                        label: format(floorNumber),
                      })) || [
                      {
                        value: 'no floors',
                        label: 'no floors',
                      },
                    ],
                  )}
                </Grid>
              )}
            </Grid>
            <Grid item>
              {renderSwitchGroup<Asset, AccessedAmenity[]>(
                formState,
                ['assetAmenities'],
                format('assetAmenities'),
                {
                  setter: setFormState as TODO,
                  postSetStateCb: () => signalSend(true),
                  signal,
                },
                amenities
                  .filter(({ type }) => type === AmenityType.Asset)
                  .map(({ name }) => ({
                    label: format(name),
                    value: name,
                  })),
                (value: string) =>
                  formState?.assetAmenities?.find(
                    (item: TODO) => item.name === value,
                  ) && (
                    <Select
                      disabled={signal}
                      label={'Access'}
                      value={
                        formState?.assetAmenities?.find(
                          (item: TODO) => item.name === value,
                        )?.access || Object.values(AmenityAccess)[0]
                      }
                      onChange={
                        ((event: React.ChangeEvent<{ value: unknown }>) => {
                          setFormState((prevState: Asset | undefined) => {
                            const newState: TODO = { ...prevState };
                            let targetArray: TODO = newState;
                            ['assetAmenities'].slice(0, -1).forEach((key) => {
                              if (!targetArray[key]) targetArray[key] = {};
                              targetArray = targetArray[key];
                            });
                            const finalKey = ['assetAmenities'][
                              ['assetAmenities'].length - 1
                            ];
                            const itemIndex = targetArray[finalKey].findIndex(
                              (item: TODO) => item.name === value,
                            );
                            if (itemIndex !== -1) {
                              targetArray[finalKey][itemIndex].access =
                                event.target.value;
                            }
                            return newState;
                          });
                          handleUpdate(formState);
                        }) as TODO
                      }
                    >
                      {Object.values(AmenityAccess).map(
                        (value) =>
                          value && (
                            <MenuItem key={value} value={value}>
                              {format(value)}
                            </MenuItem>
                          ),
                      )}
                    </Select>
                  ),
                PrimaryText,
              )}
            </Grid>
            <Grid item>
              <PrimaryText>Lease Condition:</PrimaryText>
            </Grid>
            <Grid item>
              {renderSwitchGroup<Asset, string>(
                formState,
                ['leaseCondition', 'leaseType'],
                'Accepted Lease Types',
                {
                  setter: setFormState as TODO,
                  postSetStateCb: () => handleUpdate(formState),
                  signal,
                },
                Object.values(AcceptedLeaseType).map((value) => ({
                  value,
                  label: format(value),
                })),
                undefined,
                PrimaryText,
              )}
            </Grid>
            <Grid item>
              {renderTextField<Asset>(
                formState,
                handleChange,
                ['leaseCondition', 'monthlyPrice'],
                { number: true },
              )}
            </Grid>
            <Grid item>
              {renderTextField<Asset>(
                formState,
                handleChange,
                ['leaseCondition', 'minLeaseContract'],
                { number: true },
              )}
            </Grid>
            <Grid item>
              {renderTextField(formState, handleChange, 'peopleCapacity', {
                number: true,
                label: 'Maximum People Capacity',
              })}
            </Grid>
            <Grid item>
              <Btn onClick={() => setPicturesModal(true)}>Manage Pictures</Btn>
            </Grid>
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              columnSpacing={2}
            >
              <Grid item>
                <PrimaryText variant="h5">Status:</PrimaryText>
              </Grid>
              <Grid item>
                <PrimaryText variant="h5">
                  {formState?.publishingStatus || 'Draft'}
                </PrimaryText>
              </Grid>
              <Grid item>
                <Btn
                  disabled={
                    formState?.publishingStatus === Status.Active ||
                    formState?.publishingStatus === Status.Pending ||
                    formState?.publishingStatus === Status.Suspended
                  }
                  onClick={() =>
                    server?.axiosInstance
                      .put(
                        'api/host/assets/publish_asset/' +
                          String(formState?._id),
                      )
                      .finally(() => fetchSpace(String(formState?._id)))
                  }
                >
                  Publish
                </Btn>
              </Grid>
              <Grid item>
                <Btn
                  disabled={
                    true || formState?.publishingStatus !== Status.Pending
                  }
                  onClick={() =>
                    server?.axiosInstance
                      .put(
                        'api/host/assets/withdraw_asset/' +
                          String(formState?._id),
                      )
                      .finally(() => fetchSpace(String(formState?._id)))
                  }
                >
                  Withdraw
                </Btn>
              </Grid>
              <Grid item>
                <Btn
                  disabled={formState?.publishingStatus !== Status.Active}
                  onClick={() =>
                    server?.axiosInstance
                      .put(
                        'api/host/assets/pause_asset/' + String(formState?._id),
                      )
                      .finally(() => fetchSpace(String(formState?._id)))
                  }
                >
                  Pause
                </Btn>
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid item>
            <PrimaryText padded>
              {creationInitiatedRef.current ? 'Error' : 'Loading...'}
            </PrimaryText>
          </Grid>
        )}
      </Grid>
    </>
  );
};
export default SpaceForm;
