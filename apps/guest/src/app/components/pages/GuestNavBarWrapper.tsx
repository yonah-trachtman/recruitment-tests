import { Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useContext, useMemo } from 'react';
import {
  favorites,
  home,
  messages,
  person,
  SearchContext,
} from '@offisito-frontend';
import { NavBar } from '@base-frontend';

const GuestNavBarWrapper = () => {
  const { search, results } = useContext(SearchContext);

  const useQuery = () => {
    const location = useLocation();
    return useMemo(
      () => new URLSearchParams(location.search),
      [location.search],
    );
  };

  const query = useQuery();

  return (
    (!search || results) &&
    !query.get('space') && (
      <Grid item width="100%">
        <NavBar
          buttons={[
            {
              navPath: '/',
              iconSrc: home,
            },
            {
              navPath: '/wish',
              iconSrc: favorites,
            },
            {
              navPath: '/chats',
              iconSrc: messages,
            },
            {
              navPath: '/settings',
              iconSrc: person,
            },
          ]}
        />
      </Grid>
    )
  );
};

export default GuestNavBarWrapper;
