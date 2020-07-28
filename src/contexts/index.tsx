import React from 'react';

import { SnackbarProvider } from 'notistack';
import { AuthenticationProvider } from '~/contexts/authentication';

const AppProvider: React.FC = ({ children }) => (
  <AuthenticationProvider>
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
    >
      {children}
    </SnackbarProvider>
  </AuthenticationProvider>
);

export default AppProvider;
