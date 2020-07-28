import React, { useEffect } from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FadeIn from 'react-fade-in';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from 'recharts';

import { useSnackbar } from 'notistack';
import Statistics from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';

import ProgressBar from './ProgressBar';
import Text from '~/components/Text';

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
    boxShadow: theme.shadows[5],
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

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (agreements.length <= 0) return;

    if (
      statistics.counterpart.financial > 0 ||
      statistics.counterpart.assetsAndServices > 0
    )
      return;

    enqueueSnackbar('Atenção às contrapartidas', { variant: 'warning' });
  }, [statistics, enqueueSnackbar]); // eslint-disable-line

  return (
    <Grid container style={{ marginTop: 10 }}>
      <Grid className={classes.item} item xs={12} md={6} lg={4}>
        <Paper
          className={classes.container}
          elevation={3}
          style={{ justifyContent: 'flex-start', overflowY: 'auto' }}
        >
          <Text fontSize={17} fontWeight="bold" marginY={1.5}>
            Organizações
          </Text>

          {statistics.topTenOrgans.length > 0 ? (
            statistics.topTenOrgans.map(organ => (
              <FadeIn className={classes.fadeIn}>
                <ProgressBar
                  title={organ.name}
                  value={organ.count}
                  percentage={organ.percentage}
                />
              </FadeIn>
            ))
          ) : (
            <FadeIn className={classes.fadeIn}>
              <ProgressBar
                title="Nenhuma informação"
                value={0}
                percentage={0}
              />
            </FadeIn>
          )}
        </Paper>
      </Grid>

      <Grid className={classes.item} item xs={12} md={6} lg={4}>
        <Paper
          className={classNames(classes.container, {
            [classes.containerWarning]:
              agreements.length > 0 &&
              statistics.counterpart.financial <= 0 &&
              statistics.counterpart.assetsAndServices <= 0,
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
                  convenios: statistics.counterpart.financial,
                },
                {
                  name: 'Bens e serviços',
                  convenios: statistics.counterpart.assetsAndServices,
                },
                {
                  name: 'Nenhuma',
                  convenios: statistics.counterpart.empty,
                },
              ]}
              margin={{ top: 0, right: 45, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="convenios" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid className={classes.item} item xs={12} md={12} lg={4}>
        <Paper
          className={classes.container}
          elevation={3}
          style={{ padding: 0 }}
        >
          <Text fontSize={17} fontWeight="bold" marginY={1.5}>
            Trimestres
          </Text>

          <ResponsiveContainer height={250}>
            <AreaChart
              data={[
                {
                  name: '1º',
                  convenios: statistics.trimesters[0] || 0,
                },
                {
                  name: '2º',
                  convenios: statistics.trimesters[1] || 0,
                },
                {
                  name: '3º',
                  convenios: statistics.trimesters[2] || 0,
                },
                {
                  name: '4º',
                  convenios: statistics.trimesters[3] || 0,
                },
              ]}
              margin={{ top: 0, right: 45, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />

              <Tooltip />
              <Area
                type="monotone"
                dataKey="convenios"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChartGrid;
