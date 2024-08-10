import { alpha, Backdrop, Grid } from '@mui/material';
import SearchBackdrop from './search/SearchBackdrop';
import GuestNavBarWrapper from './GuestNavBarWrapper';
import { Outlet } from 'react-router-dom';
import { UserType } from '@offisito-shared';
import {
  backgroundOffice,
  dayLogoTextOnly,
  MainMessage,
  nightLogoTextOnly,
  SearchContext,
} from '@offisito-frontend';
import { AuthContext, AuthPage, ChatContextProvider } from '@base-frontend';
import { useContext } from 'react';

export const CustomLayout = () => {
  const { user } = useContext(AuthContext);
  const { search } = useContext(SearchContext);

  return user ? (
    <ChatContextProvider domain="server.offisito.com" MainMessage={MainMessage}>
      <Grid
        height="100%"
        width="100%"
        container
        direction="column"
        justifyContent="space-between"
        alignContent="center"
        wrap="nowrap"
      >
        <Grid item width="100%" overflow="scroll" height="100%">
          {search ? (
            <Backdrop
              sx={{
                backgroundColor: (theme) =>
                  alpha(theme.palette.background.default, 0.95),
                zIndex: 100,
                position: 'relative', // can be absolute so that we see the background bluey but for lilush its relative. if absolute then need to fix position size and trinary to both - only first is conditional
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
              }}
              open
            >
              <SearchBackdrop />
            </Backdrop>
          ) : (
            <Outlet />
          )}
        </Grid>
        <GuestNavBarWrapper />
      </Grid>
    </ChatContextProvider>
  ) : (
    <AuthPage
      nightLogoTextOnly={nightLogoTextOnly}
      tenum={UserType}
      client={UserType.guest}
      dayLogoTextOnly={dayLogoTextOnly}
      backgroundPicture={backgroundOffice}
    />
  );
};
