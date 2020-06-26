import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { FiX } from 'react-icons/fi';

import Text from '~/components/Text';

interface TitleProps {
  onClose?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2.5),
  },
  closeButton: {
    color: '#303030',
    padding: 5,
  },
}));

const Title: React.FC<TitleProps> = ({ children, onClose, ...rest }) => {
  const classes = useStyles();

  return (
    <DialogTitle disableTypography className={classes.root} {...rest}>
      <Text fontSize={20} fontWeight="bold">
        {children}
      </Text>

      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <FiX size={23} strokeWidth={4} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default Title;
