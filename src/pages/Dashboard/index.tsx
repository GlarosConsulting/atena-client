import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import Button from '@material-ui/core/Button';
import { DateRangePicker, DateRange } from '@material-ui/pickers';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import ptBrLocale from 'date-fns/locale/pt-BR'; // eslint-disable-line
import { FiArrowRight, FiLogOut } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';

import { MuiPickersAdapter } from '@material-ui/pickers/_shared/hooks/useUtils';
import Statistics, { PendingAgreement } from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';
import { City } from '~/@types/Session';

import { useAuthentication } from '~/contexts/authentication';
import api from '~/services/api';

import Loading from '~/components/Loading';
import Header from '~/components/Header';
import Text from '~/components/Text';

import FilterDialog, { Filters } from './FilterDialog';
import CardGrid from './CardGrid';
import ChartGrid from './ChartGrid';

interface AgreementsResponse {
  statistics: Statistics;
  agreements: Agreement[];
  pendingAgreements: PendingAgreement[];
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
  searchButton: {
    borderRadius: '50%',
    padding: 10,
    marginLeft: 20,
    [theme.breakpoints.down('sm')]: {
      marginRight: 20,
    },
  },
  filterButton: {
    padding: theme.spacing(1, 2),
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      marginLeft: 20,
    },
  },
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();

  const { user, signOut, hasAccess } = useAuthentication();

  const [cities, setCities] = useState<City[]>([]);

  const [selectedCity, setSelectedCity] = useState('Todos');
  const [selectedSphere, setSelectedSphere] = useState(
    hasAccess(['ANY', 'MUNICIPAL_SPHERE', 'CITIES']) ? 'Municipal' : 'Estadual',
  );
  const [date, setDate] = useState<DateRange<Date | null>>([
    subDays(new Date(), 1),
    new Date(),
  ]);
  const [filters, setFilters] = useState<Filters>({});
  const [isActiveOnlyAlerts, setIsActiveOnlyAlerts] = useState(false);

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: { count: 0, value: 0 },
    execution: { count: 0, value: 0 },
    pending: { count: 0, value: 0 },
    interrupted: { count: 0, value: 0 },
    procedures: { count: 0, value: 0 },
    completed: { count: 0, value: 0 },
    topTenOrgans: [],
    counterpart: { financial: 0, assetsAndServices: 0, empty: 0 },
  });
  const [isLoading, setIsLoading] = useState(false);

  const [topPendingAgreements, setTopPendingAgreements] = useState<
    PendingAgreement[]
  >([]);

  const [isFilterDialogOpened, setIsFilterDialogOpened] = useState(false);

  const data = useMemo(
    () => ({
      UF: 'AL',
      beginDate: date[0],
      endDate: date[1],
      sphere: selectedSphere,
      cityIds:
        selectedCity !== 'Todos' && selectedSphere === 'Municipal'
          ? selectedCity
          : user?.group?.cities.map(city => city.id),
      onlyAlerts: isActiveOnlyAlerts,
    }),
    [date, selectedSphere, selectedCity, user, isActiveOnlyAlerts],
  );

  const handleSearch = useCallback(
    (_event: any, otherData = {}) => {
      setIsLoading(true);

      api
        .post<AgreementsResponse>(
          'filters',
          { filters },
          { params: { ...data, ...otherData } },
        )
        .then(response => {
          setAgreements(response.data.agreements);
          setStatistics(response.data.statistics);
          setTopPendingAgreements(response.data.pendingAgreements);

          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    },
    [filters, data],
  );

  useEffect(() => {
    async function init() {
      const response = await api.get<Agreement>('agreements/oldest');

      const newDate: DateRange<Date | null> = [
        response.data.proposalData.data.biddingDate,
        new Date(),
      ];

      setDate(newDate);

      handleSearch(null, { beginDate: newDate[0] });
    }

    init();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!hasAccess(['ANY', 'MUNICIPAL_SPHERE'])) {
      setCities(user?.group?.cities || []);
      return;
    }

    api.get<City[]>('cities').then(response => {
      setCities(response.data);
    });
  }, [user, hasAccess]);

  return (
    <>
      <Loading open={isLoading} />

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
            dateAdapter={
              (new DateFnsAdapter({
                locale: ptBrLocale,
              }) as unknown) as MuiPickersAdapter<DateRange<Date | null>>
            }
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

          <Box display="flex" alignItems="center" marginTop={{ xs: 2, sm: 0 }}>
            <ButtonBase
              className={classes.searchButton}
              disabled={isLoading}
              onClick={handleSearch}
            >
              <FaSearch size={20} color={isLoading ? '#AAA' : '#212121'} />
            </ButtonBase>

            <Button
              className={classes.filterButton}
              disabled={isLoading}
              variant="contained"
              onClick={() => setIsFilterDialogOpened(true)}
            >
              <Text fontSize={16} fontWeight="bold">
                + FILTROS
              </Text>
            </Button>

            <Box
              bgcolor="#707070"
              height={25}
              width={3}
              borderRadius={50}
              marginX={0.5}
              display={{ xs: 'none', sm: 'block' }}
            />

            <Box marginX={{ xs: 0, sm: 2 }}>
              <ButtonBase
                onClick={() => signOut()}
                style={{
                  borderRadius: '50%',
                  padding: 10,
                }}
              >
                <FiLogOut size={20} />
              </ButtonBase>
            </Box>
          </Box>
        </Box>
      </Header>

      <Container maxWidth="lg">
        <Box marginTop={2.5} marginBottom={2}>
          <CardGrid
            statistics={statistics}
            agreements={agreements || []}
            filters={filters}
            data={data}
          />
          <ChartGrid
            statistics={statistics}
            agreements={agreements || []}
            topPendingAgreements={topPendingAgreements}
          />
        </Box>
      </Container>

      <FilterDialog
        open={isFilterDialogOpened}
        data={data}
        onChange={value => setFilters(value)}
        onToggleOnlyAlerts={value => setIsActiveOnlyAlerts(value)}
        onClose={() => setIsFilterDialogOpened(false)}
      />
    </>
  );
};

export default Dashboard;
