import React from 'react';
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
            percentage={50}
          />
          <ProgressBar
            className={classes.progressBar}
            title="Min. da Cidadania"
            percentage={25}
          />
          <ProgressBar
            className={classes.progressBar}
            title="Min. da agropecuária e abastecimento"
            percentage={60}
          />
          <ProgressBar
            className={classes.progressBar}
            title="Fundo nac. de des. da educação"
            percentage={77}
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
                  convenios: 60,
                },
                {
                  name: 'Não possui',
                  convenios: 80,
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
                  convenios: 20,
                },
                {
                  name: 'Fevereiro',
                  convenios: 36,
                },
                {
                  name: 'Março',
                  convenios: 29,
                },
                {
                  name: 'Abril',
                  convenios: 55,
                },
                {
                  name: 'Maio',
                  convenios: 67,
                },
                {
                  name: 'Junho',
                  convenios: 47,
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
