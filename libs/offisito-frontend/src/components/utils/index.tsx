import { Computer, Domain, LocalParking, Wifi } from '@mui/icons-material';
import { PrimaryText } from '../../styled-components';
import { Grid } from '@mui/material';

// TODO: itai@offisito.com
export const renderAmenityIcon = (amenity: string) =>
  amenity === 'freeWiFi' ? (
    <Wifi />
  ) : amenity === 'parking' ? (
    <LocalParking />
  ) : amenity === 'lobbySpace' ? (
    <Domain />
  ) : (
    <Computer />
  );

export const MainMessage = ({ text }: { text: string }) => (
  <Grid
    height="100%"
    width="100%"
    container
    justifyContent="center"
    alignItems="center"
  >
    <Grid item>
      <PrimaryText fontWeight="bold" fontSize="150%" textAlign="center">
        {text}
      </PrimaryText>
    </Grid>
  </Grid>
);
