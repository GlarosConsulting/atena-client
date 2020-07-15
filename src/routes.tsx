import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';
import Groupings from './pages/Groupings';
import NotFound from './pages/NotFound';

const MainRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Authentication />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/groupings" element={<Groupings />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default MainRoutes;
