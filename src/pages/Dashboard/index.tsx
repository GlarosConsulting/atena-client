import React, { useState, useEffect } from 'react';
import subDays from 'date-fns/subDays';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { DateRange } from '@material-ui/pickers/DateRangePicker/RangeTypes';

import Statistics from '~/typings/Statistics';
import Agreement from '~/typings/Agreement';

import api from '~/services/api';

import Header from '~/components/Header';

import CardGrid from './CardGrid';
import ChartGrid from './ChartGrid';

interface AgreementsResponse {
  statistics: Statistics;
  agreements: Agreement[];
}

const Dashboard: React.FC = () => {
  const [city, setCity] = useState('');
  const [date, setDate] = useState<DateRange>([
    subDays(new Date(), 1),
    new Date(),
  ]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: { count: 0, value: 0 },
  });
  const [data, setData] = useState<{ [key: string]: any }>();

  function handleSearch(): void {
    const newData = {
      beginDate: date[0],
      endDate: date[1],
      UF: 'AL',
      Cidade: city.toUpperCase(),
    };

    setData(newData);

    api
      .get<AgreementsResponse>('/agreements', {
        params: newData,
      })
      .then(response => {
        console.log(response.data);
        setStatistics(response.data.statistics);
      });
  }

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header
        onCityChange={(value): void => setCity(value)}
        onDateChange={(value): void => setDate(value)}
        onSearch={handleSearch}
      />

      <Container maxWidth="lg">
        <Box marginTop={2.5} marginBottom={2}>
          <CardGrid statistics={statistics} data={data} />
          <ChartGrid data={data && { city: data.Cidade }} />
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
