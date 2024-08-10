import { Grid } from '@mui/material';
import { AuthContext, AuthPage } from '@base-frontend';
import { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import { UserType } from '@offisito-shared';
import {
  backgroundOffice,
  dayLogoTextOnly,
  nightLogoTextOnly,
  TopBar,
} from '@offisito-frontend';

const Router = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {user ? (
        <Grid
          width="100%"
          height="100%"
          container
          justifyContent="center"
          bgcolor={(theme) => theme.palette.background.default}
          wrap="nowrap"
        >
          <Grid
            item
            height="100%"
            width="1000px"
            container
            direction="column"
            bgcolor={(theme) => theme.palette.background.paper}
            wrap="nowrap"
            overflow="hidden"
          >
            <TopBar tenum={UserType} />
            <Grid item height="100%" overflow="scroll">
              <Routes>
                <Route path="/*" element={<HomePage />} />
              </Routes>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <AuthPage
          backgroundPicture={backgroundOffice}
          dayLogoTextOnly={dayLogoTextOnly}
          nightLogoTextOnly={nightLogoTextOnly}
          tenum={UserType}
          client={UserType.admin}
        />
      )}
    </BrowserRouter>
  );
};
export default Router;
