import {
  AuthContextProvider,
  EnvBorder,
  MobilzerWrapper,
  PWAPrompterWrapper,
  ServerProvider,
  useLoadBundle,
  useThemeForMVP,
} from '@base-frontend';
import Router from './components/Router';
import { Toaster } from 'react-hot-toast';
import { createTheme, ThemeProvider } from '@mui/material';
import { UserType } from '@offisito-shared';
import { MainMessage } from '@offisito-frontend';

const App = () => {
  const theme = useThemeForMVP();

  useLoadBundle();

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <EnvBorder>
        <PWAPrompterWrapper>
          <Toaster />
          <ServerProvider
            domain="server.offisito.com"
            MainMessage={MainMessage}
          >
            <AuthContextProvider MainMessage={MainMessage}>
              <Router />
            </AuthContextProvider>
          </ServerProvider>
        </PWAPrompterWrapper>
      </EnvBorder>
    </ThemeProvider>
  );
};

export default App;
