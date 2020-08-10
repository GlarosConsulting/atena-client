import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MuiDialog, { DialogProps as MuiDialogProps } from '@material-ui/core/Dialog';

export { default as DialogTitle } from './Title';
export { default as DialogContent } from './Content';
export { default as DialogActions } from './Actions';
export { default as DialogButton } from './Button';

interface CustomDialogProps {
  responsive?: boolean;
}

type DialogProps = CustomDialogProps & MuiDialogProps;

const Dialog: React.FC<DialogProps> = ({ responsive = false, children, ...rest }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MuiDialog fullScreen={responsive ? fullScreen : false} {...rest}>
      {children}
    </MuiDialog>
  );
};

export default Dialog;
