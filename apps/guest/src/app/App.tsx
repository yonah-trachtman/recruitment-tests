import {
  AuthContextProvider,
  EnvBorder,
  ServerProvider,
  useThemeForMVP,
  MobilzerWrapper,
  useLoadBundle,
  PWAPrompterWrapper,
} from '@base-frontend';
import { createTheme, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { UserType } from '@offisito-shared';
import { RouterProvider } from 'react-router-dom';
import { router } from './components/Router';
import { MainMessage, SearchContextProvider } from '@offisito-frontend';

const App = () => {
  useLoadBundle();

  const theme = useThemeForMVP();
  return (
    <ThemeProvider theme={createTheme(theme)}>
      <EnvBorder>
        <PWAPrompterWrapper>
          <MobilzerWrapper name="offisito">
            <Toaster />
            <ServerProvider
              domain="server.offisito.com"
              MainMessage={MainMessage}
            >
              <AuthContextProvider MainMessage={MainMessage}>
                <SearchContextProvider>
                  <RouterProvider router={router} />
                </SearchContextProvider>
              </AuthContextProvider>
            </ServerProvider>
          </MobilzerWrapper>
        </PWAPrompterWrapper>
      </EnvBorder>
    </ThemeProvider>
  );
};
export default App;
