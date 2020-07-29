import React, { useState, useMemo, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import capitalize from 'capitalize';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';

import { useSnackbar } from 'notistack';
import { isBefore } from 'date-fns';
import Statistics from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';

import api from '~/services/api';

import Loading from '~/components/Loading';

import Card from './Card';
import CardDialog from './Dialog';

interface CardGridProps {
  statistics: Statistics;
  agreements: Agreement[];
  data?: { [key: string]: any };
}

interface AgreementsResponse {
  statistics: Statistics;
  agreements: Agreement[];
}

const useStyles = makeStyles(theme => ({
  containerGrid: {
    padding: theme.spacing(1),
  },
  containerWarning: {
    border: '2px solid #ef9a9a',
    boxShadow: theme.shadows[6],
  },
  dialogContentSummary: {
    padding: theme.spacing(1, 1.5),
    borderRadius: 10,
    fontSize: 16,
    color: '#606060',
  },
}));

function containsCaseInsensitive(str: string | null, value: string): boolean {
  return str ? str.toLowerCase().includes(value.toLowerCase()) : false;
}

const CardGrid: React.FC<CardGridProps> = ({
  statistics,
  agreements: _agreements,
  data,
}) => {
  const classes = useStyles();

  const [dialog, setDialog] = useState<{ summary: string } | null>();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);

  const finishedBiddingsWarning = useMemo(
    () =>
      _agreements.length > 0 &&
      _agreements
        .filter(agreement =>
          agreement.convenientExecution?.executionProcesses.some(
            executionProcess =>
              containsCaseInsensitive(
                executionProcess.details?.executionProcess,
                'Licitação',
              ),
          ),
        )
        .some(agreement =>
          agreement.convenientExecution?.executionProcesses.some(
            executionProcess =>
              containsCaseInsensitive(executionProcess.accepted, 'Rejeitad'),
          ),
        ),
    [_agreements],
  );
  const finishedContractsWarning = useMemo(
    () =>
      _agreements.length > 0 &&
      _agreements
        .filter(agreement =>
          agreement.convenientExecution?.contracts.some(contract =>
            contract.details?.endDate
              ? isBefore(contract.details?.endDate, new Date())
              : true,
          ),
        )
        .some(agreement =>
          containsCaseInsensitive(
            agreement.accountability.data.status,
            'Rejeitad',
          ),
        ),
    [_agreements],
  );

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!finishedBiddingsWarning) return;

    enqueueSnackbar('Atenção às licitações concluídas', { variant: 'warning' });
  }, [finishedBiddingsWarning]); // eslint-disable-line

  useEffect(() => {
    if (!finishedContractsWarning) return;

    enqueueSnackbar('Atenção aos contratos concluídos', { variant: 'warning' });
  }, [finishedContractsWarning]); // eslint-disable-line

  function handleOpenCardDialog({ id, title }: any): void {
    setDialog({ summary: capitalize(title.label) });
    setLoading(true);

    api
      .get<AgreementsResponse>('/agreements', {
        params: {
          ...data,
          customFilter: id,
        },
      })
      .then(response => {
        setAgreements(response.data.agreements);
        setLoading(false);
      });
  }

  return (
    <>
      <Grid container>
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
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
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
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
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
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
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
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
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
          <Card
            className={classNames({
              [classes.containerWarning]: finishedBiddingsWarning,
            })}
            id="licitacoes-concluidas"
            title={{
              count: statistics.completedBiddings.count,
              label: 'licitações concluídas',
            }}
            value={statistics.completedBiddings.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
          <Card
            className={classNames({
              [classes.containerWarning]: finishedContractsWarning,
            })}
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

      <Loading open={loading} />

      <CardDialog
        open={Boolean(dialog)}
        summary={dialog?.summary}
        agreements={agreements}
        onClose={(): void => {
          setDialog(null);
          setAgreements([]);
        }}
      />
    </>
  );
};

export default CardGrid;
