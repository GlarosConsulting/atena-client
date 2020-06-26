import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import format from 'date-fns/format';
import { utcToZonedTime } from 'date-fns-tz';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import Agreement from '~/typings/Agreement';

import getTimeZone from '~/utils/getTimeZone';

import Dialog from '~/components/Dialog';
import DialogTitle from '~/components/Dialog/Title';
import DialogContent from '~/components/Dialog/Content';

import Label from './Label';

interface InfoDialogProps {
  open: boolean;
  agreement?: Agreement | null;
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

const InfoDialog: React.FC<InfoDialogProps> = ({
  open,
  agreement,
  onClose,
}) => {
  const classes = useStyles();

  return agreement ? (
    <Dialog open={open} responsive maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle onClose={onClose}>Informações</DialogTitle>
      <DialogContent dividers>
        <Paper className={classes.summary} elevation={2}>
          {`Convênio: ${agreement.agreementId}`}
        </Paper>

        <Box marginLeft={0.5}>
          <Label
            title="Modalidade"
            value={agreement.proposalData.data.modality}
          />
          <Label
            title="Número do processo"
            value={agreement.proposalData.data.proccessId}
          />
          <Label
            title="Número do edital"
            value={agreement.proposalData.data.proposalId}
          />
          <Label
            title="Data de publicação"
            value={format(
              utcToZonedTime(
                agreement.proposalData.data.proposalDate,
                getTimeZone(),
              ),
              'dd/MM/yyyy',
            )}
          />
          <Label
            title="Data de licitação"
            value={format(
              utcToZonedTime(
                agreement.proposalData.data.biddingDate,
                getTimeZone(),
              ),
              'dd/MM/yyyy',
            )}
          />
          <Label
            title="Data de homologação"
            value={format(
              utcToZonedTime(
                agreement.proposalData.data.homologationDate,
                getTimeZone(),
              ),
              'dd/MM/yyyy',
            )}
          />
          <Label
            title="Referência legal"
            value={agreement.proposalData.data.legalFoundation}
          />
          <Label
            title="Valor"
            value={Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(
              agreement.proposalData.programs.reduce(
                (accumulator, program) => accumulator + program.value,
                0,
              ),
            )}
          />
          <Label
            title="Descrição"
            value={agreement.proposalData.data.description}
          />
          <Label title="Objeto" value={agreement.proposalData.data.object} />
        </Box>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default InfoDialog;
