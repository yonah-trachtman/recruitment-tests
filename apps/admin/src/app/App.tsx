import Router from './components/Router';
import {
  AuthContextProvider,
  EnvBorder,
  ServerProvider,
  useThemeForMVP,
  useLoadBundle,
  PWAPrompterWrapper,
} from '@base-frontend';
import { createTheme, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { UserType } from '@offisito-shared';
import { MainMessage } from '@offisito-frontend';

const App = () => {
  useLoadBundle();

  const theme = useThemeForMVP();

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
