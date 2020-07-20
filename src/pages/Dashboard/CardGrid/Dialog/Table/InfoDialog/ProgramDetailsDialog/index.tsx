import React from 'react';

import { Program } from '~/@types/Agreement';

import formatValue from '~/utils/formatValue';

import Dialog from '~/components/Dialog';
import DialogTitle from '~/components/Dialog/Title';
import DialogContent from '~/components/Dialog/Content';

import Label from '../Label';

interface ProgramDetailsDialogProps {
  open: boolean;
  program?: Program | null;
  onClose: () => void;
}

const ProgramDetailsDialog: React.FC<ProgramDetailsDialogProps> = ({
  open,
  program,
  onClose,
}) => {
  return program ? (
    <Dialog open={open} responsive maxWidth="sm" fullWidth onClose={onClose}>
      <DialogTitle onClose={onClose}>Detalhes do programa</DialogTitle>
      <DialogContent dividers>
        <Label title="Código" value={program.programId} />
        <Label title="Nome" value={program.name} />
        <Label title="Itens de investimento" value={program.details.items} />
        <Label
          title="Regra de contrapartida"
          value={program.details.couterpartRule}
        />
        <Label
          title="Valor dos itens de investimento"
          value={formatValue(program.details.totalValue)}
        />
        <Label
          title="Valor de contrapartida"
          value={program.details.couterpartValues?.total}
        />
        <Label
          title="- Financeira"
          value={program.details.couterpartValues?.financial}
          style={{ marginLeft: 5 }}
        />
        <Label
          title="- Bens e serviços"
          value={program.details.couterpartValues?.assetsAndServices}
          style={{ marginLeft: 5 }}
        />
        <Label
          title="Valor de repasse"
          value={program.details.transferValues?.total}
        />
        <Label
          title="- Emenda"
          value={program.details.transferValues?.amendment}
          style={{ marginLeft: 5 }}
        />
      </DialogContent>
    </Dialog>
  ) : null;
};

export default ProgramDetailsDialog;
