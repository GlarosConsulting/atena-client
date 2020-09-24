import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactGA from 'react-ga';

import { ThemeProvider } from '@material-ui/core/styles';

import 'typeface-roboto';

import './styles/global.css';
import { light } from './styles/themes';

import AppProvider from './contexts';
import Routes from './routes';

const App: React.FC = () => {
  useEffect(() => {
    ReactGA.initialize('UA-178895843');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <>
      <Helmet>
        <title>Atena</title>
      </Helmet>

      <ThemeProvider theme={light}>
        <Router>
          <AppProvider>
            <Routes />
          </AppProvider>
        </Router>
      </ThemeProvider>
    </>
  );
};

export default App;
