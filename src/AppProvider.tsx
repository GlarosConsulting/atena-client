import React from 'react';

import { SnackbarProvider } from 'notistack';
import { AuthenticationProvider } from '~/contexts/authentication';

const Provider: React.FC = ({ children }) => (
  <AuthenticationProvider>
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {children}
    </SnackbarProvider>
  </AuthenticationProvider>
);

export default Provider;
