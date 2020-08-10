import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import logo from '~/assets/images/logo.png';

const Header: React.FC = ({ children }) => (
  <Box
    bgcolor="#e5e5e5"
    boxShadow={3}
    paddingTop={{ xs: 1.5, sm: 1 }}
    paddingBottom={{ xs: 2, sm: 1 }}
  >
    <Container>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <img src={logo} alt="Logo" style={{ width: 200, paddingRight: 25 }} />

        {children}
      </Box>
    </Container>
  </Box>
);

export default Header;
