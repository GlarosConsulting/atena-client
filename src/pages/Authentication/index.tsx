import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { SubmitHandler, FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import { useNavigate } from 'react-router-dom';
import logo from '~/assets/images/logo.png';

import Text from '~/components/Text';
import Input from '~/components/Input';
import { useAuthentication } from '~/contexts/authentication';

interface FormData {
  email: string;
  password: string;
}

const useStyles = makeStyles(theme => ({
  container: {
    padding: '25px 50px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 15,
  },
  input: {
    marginBottom: 15,
  },
}));

const Authentication: React.FC = () => {
  const classes = useStyles();

  const formRef = useRef<FormHandles>(null);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { signIn } = useAuthentication();

  const handleSubmit: SubmitHandler<FormData> = async data => {
    console.log(data);

    try {
      await signIn(data);

      enqueueSnackbar('Autenticado com sucesso.', {
        variant: 'success',
      });

      navigate('/dashboard');
    } catch {
      enqueueSnackbar('Busque seu administrador para que possa cadastrá-lo.', {
        variant: 'error',
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height={1}>
      <Paper className={classes.container} elevation={4}>
        <img src={logo} alt="Logo" style={{ width: 250 }} />

        <Form className={classes.form} ref={formRef} onSubmit={handleSubmit}>
          <Box
            display="flex"
            flexDirection="column"
            style={{
              maxHeight: 'calc(100% - 70px)',
              borderRadius: 5,
            }}
          >
            <Input
              className={classes.input}
              type="email"
              name="email"
              label="E-MAIL"
              placeholder="joao@exemplo.com"
            />

            <Input
              className={classes.input}
              type="password"
              name="password"
              label="SENHA"
              placeholder="••••••••••••"
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            disableElevation
            fullWidth
            style={{
              height: 40,
              marginTop: 20,
            }}
          >
            <Text fontWeight={900}>Enviar</Text>
          </Button>
        </Form>
      </Paper>
    </Box>
  );
};

export default Authentication;
