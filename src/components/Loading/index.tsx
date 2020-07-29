import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

interface LoadingProps {
  open: boolean;
}

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
  },
}));

const Loading: React.FC<LoadingProps> = ({ open }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
