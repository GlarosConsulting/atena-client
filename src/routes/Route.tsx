import React, { useEffect } from 'react';
import { useNavigate, Route as ReactDOMRoute } from 'react-router-dom';

import { useAuthentication } from '../contexts/authentication';

interface RouteProps {
  path: string;
  element: React.ComponentType;
  caseSensitive?: boolean;
  isPrivate?: boolean;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  element: Component,
  ...rest
}) => {
  const { isSignedIn } = useAuthentication();

  const navigate = useNavigate();

  useEffect(() => {
    if (isPrivate === isSignedIn()) return;

    navigate(isPrivate ? '/' : 'dashboard');
  }, [isPrivate, isSignedIn, navigate]);

  return <ReactDOMRoute {...rest} element={<Component />} />;
};

export default Route;
