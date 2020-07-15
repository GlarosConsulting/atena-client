import React, { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import capitalize from 'capitalize';
import Grid from '@material-ui/core/Grid';

import Statistics from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';

import api from '~/services/api';
import getRandomArbitrary from '~/utils/getRandomArbitrary';

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

  const threeDaysData = useMemo(
    () => ({
      count: getRandomArbitrary(
        statistics.total.count / 3,
        statistics.total.count / 2,
      ),
      value: getRandomArbitrary(
        statistics.total.count / 3,
        statistics.total.value / 2,
      ),
    }),
    [statistics],
  );
  const thirtyDaysData = useMemo(
    () => ({
      count: getRandomArbitrary(
        statistics.total.count / 2,
        statistics.total.count,
      ),
      value: getRandomArbitrary(
        statistics.total.count / 2,
        statistics.total.value,
      ),
    }),
    [statistics],
  );
  const newAgreementsData = useMemo(
    () =>
      data && data.Cidade === 'ARAPIRACA'
        ? {
            count: 64,
            value: 7350500,
          }
        : {
            count: 0,
            value: 0,
          },
    [data],
  );

  function handleOpenCardDialog({ title }: any): void {
    setDialog({ summary: capitalize(title.label) });

    api
      .get<AgreementsResponse>('/agreements', { params: data })
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
              label: 'convênios empenhados',
            }}
            value={statistics.total.value}
            onClick={handleOpenCardDialog}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="empenhados-3-dias"
            title={{
              count: threeDaysData.count,
              label: 'convênios empenhados nos últimos 3 dias',
            }}
            value={threeDaysData.value}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="empenhados-30-dias"
            title={{
              count: thirtyDaysData.count,
              label: 'convênios empenhados nos últimos 30 dias',
            }}
            value={thirtyDaysData.value}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="novos"
            title={{
              count: newAgreementsData.count,
              label: 'novos convênios',
            }}
            value={newAgreementsData.value}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="cronograma-em-dia"
            title={{ count: 0, label: 'convênios com cronograma em dia' }}
            value={0}
          />
        </Grid>
        <Grid className={classes.item} item xs={6} sm={3} md={2}>
          <Card
            id="cronograma-adiantado"
            title={{ count: 0, label: 'convênios com cronograma adiantado' }}
            value={0}
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
