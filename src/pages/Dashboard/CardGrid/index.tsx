import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import capitalize from 'capitalize';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';

import { useSnackbar } from 'notistack';

import { isBefore, parse } from 'date-fns';
import Statistics from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';

import api from '~/services/api';

import Loading from '~/components/Loading';

import Card from './Card';
import CardDialog from './Dialog';
import { Filters } from '~/pages/Dashboard/FilterDialog';

interface CardGridProps {
  statistics: Statistics;
  agreements: Agreement[];
  filters?: Filters;
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
    background: '#ef9a9a',
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
  filters,
  data,
}) => {
  const classes = useStyles();

  const [dialog, setDialog] = useState<{ summary: string } | null>();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<string[]>([]);
  const [erroredProcedures, setErroredProcedures] = useState<string[]>([]);
  const [erroredFinished, setErroredFinished] = useState<string[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (_agreements.length <= 0) return;

    const agreementIds = _agreements
      .filter(
        agreement =>
          (containsCaseInsensitive(
            agreement.proposalData?.data?.modality,
            'Licitação',
          ) ||
            containsCaseInsensitive(
              agreement.proposalData?.data?.modality,
              'Dispensa',
            ) ||
            containsCaseInsensitive(
              agreement.proposalData?.data?.modality,
              'Inexigibilidade',
            ) ||
            containsCaseInsensitive(
              agreement.proposalData?.data?.modality,
              'Subconvênio',
            )) &&
          agreement.convenientExecution?.executionProcesses.some(
            executionProcess =>
              containsCaseInsensitive(executionProcess.accepted, 'Rejeitad'),
          ),
      )
      .map(agreement => agreement.id);

    setErroredProcedures(agreementIds);
  }, [_agreements]);

  useEffect(() => {
    if (_agreements.length <= 0) return;

    const agreementIds = _agreements
      .filter(agreement => {
        const validity = agreement.accountability?.data?.validity;

        if (!validity) return false;

        const [, endValidityDate] = validity.split(' a ');

        return (
          isBefore(
            parse(endValidityDate, 'dd/MM/yyyy', new Date()),
            new Date(),
          ) &&
          containsCaseInsensitive(
            agreement?.accountability?.data?.status,
            'Enviada para Análise',
          )
        );
      })
      .map(agreement => agreement.id);

    setErroredFinished(agreementIds);
  }, [_agreements]);

  useEffect(() => {
    if (erroredProcedures.length <= 0) return;

    enqueueSnackbar('Atenção às licitações concluídas', { variant: 'warning' });
  }, [erroredProcedures]); // eslint-disable-line

  useEffect(() => {
    if (erroredFinished.length <= 0) return;

    enqueueSnackbar('Atenção aos contratos concluídos', { variant: 'warning' });
  }, [erroredFinished]); // eslint-disable-line

  function handleOpenCardDialog({ id, title }: any): void {
    setDialog({ summary: capitalize(title.label) });
    setLoading(true);

    switch (id) {
      case 'procedimentos':
        setErrors(erroredProcedures);
        break;
      case 'concluidas':
        setErrors(erroredFinished);
        break;
      default:
        setErrors([]);
        break;
    }

    api
      .post<AgreementsResponse>(
        'filters',
        { filters },
        {
          params: {
            ...data,
            customFilter: id,
          },
        },
      )
      .then(response => {
        setAgreements(response.data.agreements);
        setLoading(false);
      })
      .catch(() => {
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
              label: 'transferências voluntárias',
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
              label: 'transferências voluntárias em execução',
            }}
            value={statistics.execution.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
          <Card
            id="pendencias-negativadas"
            title={{
              count: statistics.pending.count,
              label: 'transferências voluntárias com pendências ou negativadas',
            }}
            value={statistics.pending.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
          <Card
            id="interrompidas"
            title={{
              count: statistics.interrupted.count,
              label: 'transferências voluntárias interrompidas',
            }}
            value={statistics.interrupted.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
          <Card
            className={classNames({
              [classes.containerWarning]: erroredProcedures.length > 0,
            })}
            id="procedimentos"
            title={{
              count: statistics.procedures.count,
              label: 'procedimentos licitatórios',
            }}
            value={statistics.procedures.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.containerGrid} item xs={6} sm={3} md={2}>
          <Card
            className={classNames({
              [classes.containerWarning]: erroredFinished.length > 0,
            })}
            id="concluidas"
            title={{
              count: statistics.completed.count,
              label: 'transferências voluntárias concluídas no período',
            }}
            value={statistics.completed.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
      </Grid>

      <Loading open={loading} />

      <CardDialog
        open={Boolean(dialog)}
        summary={dialog?.summary}
        agreements={agreements}
        errors={errors}
        onClose={(): void => {
          setDialog(null);
          setAgreements([]);
        }}
      />
    </>
  );
};

export default CardGrid;
