import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Agreement from '~/@types/Agreement';

import Dialog from '~/components/Dialog';
import DialogTitle from '~/components/Dialog/Title';
import DialogContent from '~/components/Dialog/Content';

import Table from './Table';

interface CardDialogProps {
  open: boolean;
  summary?: string;
  agreements: Agreement[];
  errors: string[];
  onClose: () => void;
}

const useStyles = makeStyles(theme => ({
  summary: {
    padding: theme.spacing(2, 2.5),
    backgroundColor: theme.palette.primary.light,
    borderRadius: 10,
    fontSize: 16,
    color: '#505050',
    marginBottom: theme.spacing(2),
  },
}));

const CardDialog: React.FC<CardDialogProps> = ({
  open,
  summary,
  agreements,
  errors,
  onClose,
}) => {
  const classes = useStyles();

  return (
    <Dialog open={open} responsive maxWidth="lg" fullWidth onClose={onClose}>
      <DialogTitle onClose={onClose}>Convênios</DialogTitle>
      <DialogContent dividers>
        {summary && (
          <Paper className={classes.summary} elevation={2}>
            {summary}
          </Paper>
        )}

        <Table data={agreements} errors={errors} />
      </DialogContent>
    </Dialog>
  );
};

export default CardDialog;
