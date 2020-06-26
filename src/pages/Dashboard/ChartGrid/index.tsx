import React, { useMemo } from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
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

import ProgressBar from './ProgressBar';

interface ChartGridProps {
  data?: { city: string };
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
    padding: theme.spacing(2, 3, 3),
    backgroundColor: lighten(theme.palette.primary.light, 0.6),
    borderRadius: 10,
    height: '100%',
    transition: 'all 200ms ease',
    '&:hover': {
      boxShadow: theme.shadows[5],
    },
  },
  progressBar: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const ChartGrid: React.FC<ChartGridProps> = ({ data = { city: '' } }) => {
  const classes = useStyles();

  const progressBarData = useMemo<{ [key: string]: number[] }>(
    () => ({
      'AGUA BRANCA': [50, 25, 35, 80],
      ANADIA: [12, 54, 43, 80],
      ARAPIRACA: [64, 44, 65, 44],
      ATALAIA: [32, 33, 12, 33],
      'BARRA DE SANTO ANTONIO': [50, 25, 35, 80],
      'BARRA DE SÃO MIGUEL': [12, 33, 44, 54],
      BATALHA: [65, 34, 45, 80],
      BELEM: [12, 25, 12, 33],
      'BELO MONTE': [54, 24, 21, 23],
      'BOCA DA MATA': [12, 23, 55, 44],
      '': [12, 34, 10, 24],
    }),
    [],
  );
  const barAndAreaData = useMemo<{ [key: string]: number[] }>(
    () => ({
      'AGUA BRANCA': [50, 25, 35, 80, 32, 42],
      ANADIA: [12, 54, 43, 80, 14, 32],
      ARAPIRACA: [64, 44, 65, 44, 12, 53],
      ATALAIA: [32, 33, 12, 33, 32, 5],
      'BARRA DE SANTO ANTONIO': [50, 25, 35, 80, 54, 12],
      'BARRA DE SÃO MIGUEL': [12, 33, 44, 54, 34, 15],
      BATALHA: [65, 34, 45, 80, 32, 42],
      BELEM: [12, 25, 12, 33, 32, 72],
      'BELO MONTE': [54, 24, 21, 23, 32, 91],
      'BOCA DA MATA': [12, 23, 55, 44, 32, 24],
      '': [12, 34, 10, 24, 32, 91],
    }),
    [],
  );

  return (
    <Grid container style={{ marginTop: 10 }}>
      <Grid className={classes.item} item xs={12} md={6} lg={4}>
        <Paper
          className={classes.container}
          elevation={3}
          style={{ justifyContent: 'flex-start' }}
        >
          <ProgressBar
            className={classes.progressBar}
            title="Min. Desenvolvimento Regional"
            percentage={progressBarData[data.city][0]}
          />
          <ProgressBar
            className={classes.progressBar}
            title="Min. da Cidadania"
            percentage={progressBarData[data.city][1]}
          />
          <ProgressBar
            className={classes.progressBar}
            title="Min. da agropecuária e abastecimento"
            percentage={progressBarData[data.city][2]}
          />
          <ProgressBar
            className={classes.progressBar}
            title="Fundo nac. de des. da educação"
            percentage={progressBarData[data.city][3]}
          />
        </Paper>
      </Grid>

      <Grid className={classes.item} item xs={12} md={6} lg={4}>
        <Paper
          className={classes.container}
          elevation={3}
          style={{ padding: 0 }}
        >
          <ResponsiveContainer height={300}>
            <BarChart
              width={730}
              height={250}
              data={[
                {
                  name: 'Possui contrapartida',
                  convenios: barAndAreaData[data.city][0],
                },
                {
                  name: 'Não possui',
                  convenios: barAndAreaData[data.city][1],
                },
              ]}
              margin={{ top: 30, right: 35, left: 0, bottom: 0 }}
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
          <ResponsiveContainer height={300}>
            <AreaChart
              data={[
                {
                  name: 'Janeiro',
                  convenios: barAndAreaData[data.city][0],
                },
                {
                  name: 'Fevereiro',
                  convenios: barAndAreaData[data.city][1],
                },
                {
                  name: 'Março',
                  convenios: barAndAreaData[data.city][2],
                },
                {
                  name: 'Abril',
                  convenios: barAndAreaData[data.city][3],
                },
                {
                  name: 'Maio',
                  convenios: barAndAreaData[data.city][4],
                },
                {
                  name: 'Junho',
                  convenios: barAndAreaData[data.city][5],
                },
              ]}
              margin={{ top: 30, right: 35, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
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
