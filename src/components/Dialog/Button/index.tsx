import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiButton, { ButtonProps } from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2.25),
    paddingRight: theme.spacing(2.25),
    textTransform: 'none',
    border: '2px solid #E0E0E0',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  },
}));

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  const classes = useStyles();

  return (
    <MuiButton className={classes.root} {...rest}>
      {children}
    </MuiButton>
  );
};

export default Button;
