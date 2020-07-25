import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import subDays from 'date-fns/subDays'; // eslint-disable-line
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import ButtonBase from '@material-ui/core/ButtonBase';
import { DateRangePicker, DateRange } from '@material-ui/pickers';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import ptBrLocale from 'date-fns/locale/pt-BR'; // eslint-disable-line
import { FiArrowRight, FiLogOut } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';

import Statistics from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';

import { useAuthentication } from '~/contexts/authentication';
import api from '~/services/api';

import Header from '~/components/Header';

import CardGrid from './CardGrid';
import ChartGrid from './ChartGrid';
import { City } from '~/@types/Session';

interface AgreementsResponse {
  statistics: Statistics;
  agreements: Agreement[];
}

const useStyles = makeStyles(theme => ({
  fieldResponsiveContainer: {
    [theme.breakpoints.only('xs')]: {
      marginTop: 10,
      marginBottom: 5,
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 0,
    },
  },
  selectFormControl: {
    width: 150,
    minWidth: 130,
  },
  dateRangeInputField: {
    maxWidth: 150,
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();

  const { user, signOut, hasAccess } = useAuthentication();

  const [selectedCity, setSelectedCity] = useState('Todos');
  const [selectedSphere, setSelectedSphere] = useState(
    hasAccess(['ANY', 'MUNICIPAL_SPHERE', 'CITIES']) ? 'Municipal' : 'Estadual',
  );
  const [date, setDate] = useState<DateRange>([
    subDays(new Date(), 1),
    new Date(),
  ]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: { count: 0, value: 0 },
    execution: { count: 0, value: 0 },
    transfer: { count: 0, value: 0 },
    transferInExecution: { count: 0, value: 0 },
    completedBiddings: { count: 0, value: 0 },
    completedContracts: { count: 0, value: 0 },
    topTenOrgans: [],
    counterpart: { financial: 0, assetsAndServices: 0, empty: 0 },
    trimesters: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
    },
  });
  const [data, setData] = useState<{ [key: string]: any }>();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(() => {
    const newData = {
      UF: 'AL',
      beginDate: date[0],
      endDate: date[1],
      sphere: selectedSphere,
      cityIds:
        selectedCity !== 'Todos' && selectedSphere === 'Municipal'
          ? selectedCity
          : user?.group?.cities.map(city => city.id),
    };

    setData(newData);
    setLoading(true);

    api
      .get<AgreementsResponse>('/agreements', {
        params: newData,
      })
      .then(response => {
        setStatistics(response.data.statistics);
        setLoading(false);
      });
  }, [date, selectedSphere, selectedCity, user]);

  useEffect(() => {
    handleSearch();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!hasAccess(['ANY', 'MUNICIPAL_SPHERE'])) {
      setCities(user.group?.cities || []);
      return;
    }

    api.get<City[]>('cities').then(response => {
      setCities(response.data);
    });
  }, [user, hasAccess]);

  return (
    <>
      <Header>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems="center"
        >
          <Box display="flex" alignItems="center">
            <FormControl
              className={classNames(
                classes.selectFormControl,
                classes.fieldResponsiveContainer,
              )}
              variant="outlined"
            >
              <InputLabel id="sphere-select-label">Esfera</InputLabel>
              <Select
                labelId="sphere-select-label"
                id="sphere-select"
                value={selectedSphere}
                onChange={(event): void =>
                  setSelectedSphere(event.target.value as string)
                }
                label="Esfera"
              >
                {hasAccess(['ANY', 'MUNICIPAL_SPHERE', 'CITIES']) && (
                  <MenuItem value="Municipal">Municipal</MenuItem>
                )}
                {hasAccess(['ANY', 'STATE_SPHERE']) && (
                  <MenuItem value="Estadual">Estadual</MenuItem>
                )}
              </Select>
            </FormControl>

            {hasAccess(['ANY', 'MUNICIPAL_SPHERE', 'CITIES']) &&
              selectedSphere === 'Municipal' && (
                <FormControl
                  className={classNames(
                    classes.selectFormControl,
                    classes.fieldResponsiveContainer,
                  )}
                  variant="outlined"
                  style={{ marginLeft: 15 }}
                >
                  <InputLabel id="city-select-label">Municípios</InputLabel>
                  <Select
                    labelId="city-select-label"
                    id="city-select"
                    value={selectedCity}
                    onChange={(event): void =>
                      setSelectedCity(event.target.value as string)
                    }
                    label="Municípios"
                  >
                    <MenuItem value="Todos">
                      <em>Todos</em>
                    </MenuItem>
                    {cities.map(city => (
                      <MenuItem value={city.id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
          </Box>

          <Box
            bgcolor="#707070"
            height={25}
            width={3}
            borderRadius={50}
            marginX={2.5}
            display={{ xs: 'none', sm: 'block' }}
          />

          <DateRangePicker
            startText="Início"
            endText="Fim"
            value={date}
            dateAdapter={new DateFnsAdapter({ locale: ptBrLocale })}
            renderInput={(startProps, endProps): React.ReactElement => (
              <Box
                className={classes.fieldResponsiveContainer}
                display="flex"
                alignItems="center"
              >
                <TextField
                  className={classes.dateRangeInputField}
                  {...startProps}
                  helperText=""
                />
                <FiArrowRight size={25} style={{ margin: '0 10px' }} />
                <TextField
                  className={classes.dateRangeInputField}
                  {...endProps}
                  helperText=""
                />
              </Box>
            )}
            onChange={(value): void => setDate(value)}
          />

          <ButtonBase
            disabled={loading}
            onClick={handleSearch}
            style={{
              borderRadius: '50%',
              padding: 10,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <FaSearch size={20} color={loading ? '#AAA' : '#212121'} />
          </ButtonBase>

          <Box
            bgcolor="#707070"
            height={25}
            width={3}
            borderRadius={50}
            marginX={0.5}
            display={{ xs: 'none', sm: 'block' }}
          />

          <ButtonBase
            onClick={() => signOut()}
            style={{
              borderRadius: '50%',
              padding: 10,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <FiLogOut size={20} />
          </ButtonBase>
        </Box>
      </Header>

      <Container maxWidth="lg">
        <Box marginTop={2.5} marginBottom={2}>
          <CardGrid statistics={statistics} data={data} />
          <ChartGrid statistics={statistics} />
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
