import { withStyles, darken } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';

export default withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    '&::-webkit-scrollbar': {
      width: 10,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: darken(theme.palette.primary.main, 0.15),
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: darken(theme.palette.primary.main, 0.25),
    },
  },
}))(DialogContent);
