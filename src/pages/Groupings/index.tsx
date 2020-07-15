import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import Header from '~/components/Header';
import Text from '~/components/Text';

import Users from './Users';
import Groups from './Groups';

const useStyles = makeStyles({
  title: {
    display: 'flex',
    alignItems: 'center',
    '&::after': {
      content: '""',
      width: '100%',
      height: 2,
      marginLeft: 15,
      backgroundColor: '#BBB',
    },
  },
});

const Groupings: React.FC = () => {
  const classes = useStyles();

  const navigate = useNavigate();

  function handleGoBack(): void {
    navigate('/dashboard');
  }

  return (
    <>
      <Header>
        <Box
          display="flex"
          alignItems="center"
          style={{ cursor: 'pointer' }}
          onClick={handleGoBack}
        >
          <FiArrowLeft size={25} strokeWidth={3} color="#484848" />
          <Text fontSize={18} fontWeight={500} color="#484848" marginLeft={1}>
            Voltar
          </Text>
        </Box>
      </Header>

      <Container maxWidth="lg">
        <Box marginY={5}>
          <Box>
            <Text
              className={classes.title}
              fontSize={21}
              fontWeight="bold"
              color="#808080"
              marginLeft={0.5}
            >
              Usuários
            </Text>
            <Users style={{ marginTop: 5 }} />
          </Box>
          <Box marginTop={5}>
            <Text
              className={classes.title}
              fontSize={21}
              fontWeight="bold"
              color="#808080"
              marginLeft={0.5}
            >
              Grupos
            </Text>
            <Groups style={{ marginTop: 5 }} />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Groupings;
