import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import capitalize from 'capitalize';
import Grid from '@material-ui/core/Grid';

import Statistics from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';

import api from '~/services/api';

import Card from './Card';
import CardDialog from './Dialog';

interface CardGridProps {
  statistics: Statistics;
  data?: { [key: string]: any };
}

interface AgreementsResponse {
  statistics: Statistics;
  agreements: Agreement[];
}

const useStyles = makeStyles(theme => ({
  item: {
    padding: theme.spacing(1),
  },
  dialogContentSummary: {
    padding: theme.spacing(1, 1.5),
    borderRadius: 10,
    fontSize: 16,
    color: '#606060',
  },
}));

const CardGrid: React.FC<CardGridProps> = ({ statistics, data }) => {
  const classes = useStyles();

  const [dialog, setDialog] = useState<{ summary: string } | null>();
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  function handleOpenCardDialog({ id, title }: any): void {
    setDialog({ summary: capitalize(title.label) });

    api
      .get<AgreementsResponse>('/agreements', {
        params: {
          ...data,
          customFilter: id,
        },
      })
      .then(response => {
        setAgreements(response.data.agreements);
      });
  }

  return (
    <>
      <Grid container>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="empenhados"
            title={{
              count: statistics.total.count,
              label: 'convênios no total',
            }}
            value={statistics.total.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="execucao"
            title={{
              count: statistics.execution.count,
              label: 'convênios em execução',
            }}
            value={statistics.execution.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="contratos-repasse"
            title={{
              count: statistics.transfer.count,
              label: 'contratos de repasse',
            }}
            value={statistics.transfer.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="contratos-repasse-execucao"
            title={{
              count: statistics.transferInExecution.count,
              label: 'contratos de repasse em execução',
            }}
            value={statistics.transferInExecution.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="licitacoes-concluidas"
            title={{
              count: statistics.completedBiddings.count,
              label: 'licitações concluídas',
            }}
            value={statistics.completedBiddings.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="contratos-concluidos"
            title={{
              count: statistics.completedContracts.count,
              label: 'contratos concluídos',
            }}
            value={statistics.completedContracts.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
      </Grid>

      <CardDialog
        open={Boolean(dialog)}
        summary={dialog?.summary}
        agreements={agreements}
        onClose={(): void => setDialog(null)}
      />
    </>
  );
};

export default CardGrid;
