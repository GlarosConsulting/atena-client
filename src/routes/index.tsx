import React from 'react';
import { Routes } from 'react-router-dom';

import Route from './Route';
import Authentication from '../pages/Authentication';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import NotFound from '../pages/NotFound';

const MainRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={Authentication} />
    <Route path="dashboard" element={Dashboard} isPrivate />
    <Route path="users" element={Users} isPrivate />

    <Route path="*" element={NotFound} />
  </Routes>
);

export default MainRoutes;
