import React from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { Routes } from 'react-router-dom';

import Route from './Route';
import Authentication from '../pages/Authentication';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import NotFound from '../pages/NotFound';
import { useAuthentication } from '~/contexts/authentication';

const MainRoutes: React.FC = () => {
  const { signOut } = useAuthentication();

  useIdleTimer({
    timeout: 1000 * 60 * 30,
    onIdle: signOut,
    debounce: 500,
  });

  return (
    <Routes>
      <Route path="/" element={Authentication} />
      <Route path="dashboard" element={Dashboard} isPrivate />
      <Route path="users" element={Users} isPrivate />

      <Route path="*" element={NotFound} />
    </Routes>
  );
};

export default MainRoutes;
