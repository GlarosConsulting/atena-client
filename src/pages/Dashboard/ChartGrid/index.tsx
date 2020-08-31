import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FadeIn from 'react-fade-in';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import { useSnackbar } from 'notistack';
import Statistics, { PendingAgreement } from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';

import ProgressBar from './ProgressBar';
import Text from '~/components/Text';
import api from '~/services/api';

interface ChartGridProps {
  statistics: Statistics;
  agreements: Agreement[];
}

const useStyles = makeStyles(theme => ({
  item: {
    padding: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 3, 3),
    backgroundColor: lighten(theme.palette.primary.light, 0.6),
    borderRadius: 10,
    height: '100%',
    maxHeight: 302,
    transition: 'all 200ms ease',
    '&:hover': {
      boxShadow: theme.shadows[5],
    },
  },
  containerWarning: {
    border: '2px solid #ef9a9a',
    boxShadow: theme.shadows[6],
  },
  fadeIn: {
    width: '100%',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const ChartGrid: React.FC<ChartGridProps> = ({ statistics, agreements }) => {
  const classes = useStyles();

  const [topPendingAgreements, setTopPendingAgreements] = useState<
    PendingAgreement[]
  >([]);

  const counterpartWarning = useMemo(
    () =>
      agreements.length > 0 &&
      statistics.counterpart.financial <= 0 &&
      statistics.counterpart.assetsAndServices <= 0,
    [statistics], // eslint-disable-line
  );

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!counterpartWarning) return;

    enqueueSnackbar('Atenção às contrapartidas', { variant: 'warning' });
  }, [counterpartWarning]); // eslint-disable-line

  useEffect(() => {
    api.get('agreements/pending').then(response => {
      setTopPendingAgreements(response.data);
    });
  }, []);

  return (
    <Grid container style={{ marginTop: 10 }}>
      <Grid className={classes.item} item xs={12} md={6} lg={4}>
        <Paper
          className={classes.container}
          elevation={3}
          style={{ justifyContent: 'flex-start', overflowY: 'auto' }}
        >
          <Text fontSize={17} fontWeight="bold" marginY={1.5}>
            Transferências voluntárias por concedente
          </Text>

          {statistics.topTenOrgans.length > 0 ? (
            statistics.topTenOrgans.map(organ => (
              <FadeIn className={classes.fadeIn}>
                <ProgressBar
                  title={organ.name}
                  value={Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(organ.value)}
                  percentage={organ.percentage}
                />
              </FadeIn>
            ))
          ) : (
            <FadeIn className={classes.fadeIn}>
              <ProgressBar
                title="Nenhuma informação"
                value="-"
                percentage={0}
              />
            </FadeIn>
          )}
        </Paper>
      </Grid>

      <Grid className={classes.item} item xs={12} md={6} lg={4}>
        <Paper
          className={classNames(classes.container, {
            [classes.containerWarning]: counterpartWarning,
          })}
          elevation={3}
          style={{ padding: 0 }}
        >
          <Text fontSize={17} fontWeight="bold" marginY={1.5}>
            Contrapartida
          </Text>

          <ResponsiveContainer height={250}>
            <BarChart
              width={730}
              height={250}
              data={[
                {
                  name: 'Financeira',
                  valor: statistics.counterpart.financial,
                },
                {
                  name: 'Bens e serviços',
                  valor: statistics.counterpart.assetsAndServices,
                },
                {
                  name: 'Nenhuma',
                  valor: statistics.counterpart.empty,
                },
              ]}
              margin={{ top: 0, right: 40, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={value => {
                  return Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value as number);
                }}
              />
              <Tooltip
                formatter={value => {
                  return Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(value as number);
                }}
              />
              <Bar dataKey="valor" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid className={classes.item} item xs={12} md={12} lg={4}>
        <Paper
          className={classes.container}
          elevation={3}
          style={{ justifyContent: 'flex-start', overflowY: 'auto' }}
        >
          <Text fontSize={17} fontWeight="bold" marginY={1.5}>
            Prestações de conta em atraso
          </Text>

          {topPendingAgreements.length > 0 ? (
            topPendingAgreements.map(pendingAgreement => (
              <FadeIn className={classes.fadeIn}>
                <ProgressBar
                  title={pendingAgreement.name}
                  value={Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(pendingAgreement.value)}
                  percentage={pendingAgreement.percentage}
                />
              </FadeIn>
            ))
          ) : (
            <FadeIn className={classes.fadeIn}>
              <ProgressBar
                title="Nenhuma informação"
                value="-"
                percentage={0}
              />
            </FadeIn>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChartGrid;
