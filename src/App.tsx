import React from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';

import 'typeface-roboto';

import './styles/global.css';
import { light } from './styles/themes';

import Routes from './routes';

const App: React.FC = () => (
  <>
    <Helmet>
      <title>Atena</title>
    </Helmet>

    <ThemeProvider theme={light}>
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  </>
);

export default App;
