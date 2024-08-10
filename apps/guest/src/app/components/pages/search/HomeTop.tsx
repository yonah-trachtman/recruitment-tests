import { LocationOn, Search } from '@mui/icons-material';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IconColorer, ServerContext } from '@base-frontend';
import { Grid, IconButton } from '@mui/material';
import { findMe } from '@base-frontend';
import { PrimaryText } from '@offisito-frontend';

interface HomeTopProps {
  setSearch: Dispatch<SetStateAction<boolean>>;
}

const HomeTop = ({ setSearch }: HomeTopProps) => {
  const [address, setAddress] = useState('Current Address');
  const server = useContext(ServerContext);
  const axiosInstance = server?.axiosInstance;

  useEffect(() => {
    findMe().then(
      (location) =>
        location &&
        axiosInstance &&
        axiosInstance
          .get('/api/geo/getAddress/' + location.lat + ',' + location.lng)
          .then((r) => setAddress(r.data || 'Current Address')),
    );
  }, [axiosInstance]);

  return (
    <Grid container justifyContent="space-between">
      <Grid item>
        <IconButton>
          <IconColorer>
            <LocationOn />
          </IconColorer>
          <PrimaryText>{address}</PrimaryText>
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={() => setSearch(true)}>
          <IconColorer>
            <Search />
          </IconColorer>
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default HomeTop;
