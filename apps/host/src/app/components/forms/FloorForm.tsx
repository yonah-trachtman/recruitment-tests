import { Dispatch, SetStateAction, useContext } from 'react';
import {
  AmenityAccess,
  AmenityType,
  Company,
  Floor,
  AccessedAmenity,
} from '@offisito-shared';
import { Grid, MenuItem, Modal, Select } from '@mui/material';
import {
  IconColorer,
  renderSwitch,
  renderSwitchGroup,
  renderTextField,
} from '@base-frontend';
import { Save } from '@mui/icons-material';
import { Btn, ListingsContext, PrimaryText } from '@offisito-frontend';
import { format } from '@base-shared';
import { TODO } from '@base-shared';

interface FloorFormProps {
  formState: Floor;
  setFormState: Dispatch<SetStateAction<Floor | undefined>>;
  setFloors: Dispatch<SetStateAction<Floor[]>>;
}

const FloorForm = ({ formState, setFormState, setFloors }: FloorFormProps) => {
  const handleChange = (name: string, value: string | Date | boolean) => {
    formState &&
      setFormState(((prevState: Company) => ({
        ...prevState,
        [name]: value,
      })) as TODO);
  };

  const { amenities } = useContext(ListingsContext);

  return (
    <Modal open>
      <Grid
        height="70%"
        width="70%"
        marginLeft="15%"
        marginTop="8%"
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
          <PrimaryText variant="h4">Floor Details</PrimaryText>
        </Grid>
        <Grid item>
          {renderTextField<Floor>(
            formState,
            handleChange as TODO,
            'floorNumber',
          )}
        </Grid>
        <Grid item>
          {renderSwitch<Floor>(formState, handleChange as TODO, ['fullFloor'], {
            label: { truthy: format('fullFloor') },
          })}
        </Grid>
        <Grid item>
          {renderSwitchGroup<Floor, AccessedAmenity[]>(
            formState,
            ['floorAmenities'],
            format('floorAmenities'),
            {
              setter: setFormState as TODO,
              //  postSetStateCb: () => handleUpdate(formState),
            },
            amenities
              .filter(({ type }) => type === AmenityType.Floor)
              .map(({ name }) => ({
                label: format(name),
                value: name,
              })),
            (value: string) =>
              formState?.floorAmenities?.find(
                (item: TODO) => item.name === value,
              ) && (
                <Select
                  label={'Access'}
                  value={
                    formState?.floorAmenities?.find(
                      (item: TODO) => item.name === value,
                    )?.access || Object.values(AmenityAccess)[0]
                  }
                  onChange={
                    ((event: React.ChangeEvent<{ value: unknown }>) => {
                      setFormState((prevState: Floor | undefined) => {
                        const newState: TODO = prevState
                          ? { ...prevState }
                          : {};
                        let targetArray: TODO = newState;
                        ['floorAmenities'].slice(0, -1).forEach((key) => {
                          if (!targetArray[key]) targetArray[key] = {};
                          targetArray = targetArray[key];
                        });
                        const finalKey = ['floorAmenities'][
                          ['floorAmenities'].length - 1
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
          {renderSwitchGroup<Floor, AccessedAmenity[]>(
            formState,
            ['kitchenAmenities'],
            format('kitchenAmenities'),
            {
              setter: setFormState as TODO,
              //  postSetStateCb: () => handleUpdate(formState),
            },
            amenities
              .filter(({ type }) => type === AmenityType.Kitchen)
              .map(({ name }) => ({
                label: format(name),
                value: name,
              })),
            undefined,
            PrimaryText,
          )}
        </Grid>
        <Grid item>
          <Btn
            onClick={() =>
              setFloors((p) => {
                p.push(formState);
                setFormState(undefined);
                return p;
              })
            }
          >
            Save
            <IconColorer>
              <Save />
            </IconColorer>
          </Btn>
        </Grid>
      </Grid>
    </Modal>
  );
};
export default FloorForm;
