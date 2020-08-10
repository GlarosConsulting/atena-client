import React from 'react';

import { ExecutionProcess } from '~/@types/Agreement';

import Dialog from '~/components/Dialog';
import DialogTitle from '~/components/Dialog/Title';
import DialogContent from '~/components/Dialog/Content';

import Label from '../Label';
import formatValue from '~/utils/formatValue';
import formatDate from '~/utils/formatDate';

interface ProgramDetailsDialogProps {
  open: boolean;
  executionProcess?: ExecutionProcess | null;
  onClose: () => void;
}

const ProgramDetailsDialog: React.FC<ProgramDetailsDialogProps> = ({
  open,
  executionProcess,
  onClose,
}) => {
  return executionProcess ? (
    <Dialog open={open} responsive maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle onClose={onClose}>Detalhes do processo</DialogTitle>
      <DialogContent dividers>
        <Label
          title="Processo de execução"
          value={executionProcess.details.executionProcess}
        />
        <Label
          title="Tipo de compra"
          value={executionProcess.details.buyType}
        />
        <Label title="Situação" value={executionProcess.details.status} />
        <Label title="Modalidade" value={executionProcess.details.modality} />
        <Label
          title="Tipo de licitação"
          value={executionProcess.details.biddingType}
        />
        <Label
          title="Número do processo"
          value={executionProcess.details.processId}
        />
        <Label
          title="Número da licitação"
          value={executionProcess.details.biddingId}
        />
        <Label title="Objeto" value={executionProcess.details.object} />
        <Label
          title="Fundamento legal"
          value={executionProcess.details.legalFoundation}
        />
        <Label
          title="Justificativa"
          value={executionProcess.details.justification}
        />
        <Label
          title="Data de publicação do edital"
          value={formatDate(executionProcess.details.publishDate)}
        />
        <Label
          title="Data de abertura da licitação"
          value={formatDate(executionProcess.details.beginDate)}
        />
        <Label
          title="Data de encerramento da licitação"
          value={formatDate(executionProcess.details.endDate)}
        />
        <Label
          title="Data de homologação"
          value={formatDate(executionProcess.details.homologationDate)}
        />
        <Label
          title="Valor da licitação"
          value={formatValue(executionProcess.details.biddingValue)}
        />
        <Label
          title="Data da análise"
          value={formatDate(executionProcess.details.analysisDate)}
        />
        <Label
          title="Aceite do processo de execução"
          value={executionProcess.details.accepted}
        />
      </DialogContent>
    </Dialog>
  ) : null;
};

export default ProgramDetailsDialog;
