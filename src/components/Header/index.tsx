/* eslint-disable import/no-duplicates */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import subDays from 'date-fns/subDays';
import classNames from 'classnames';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import ButtonBase from '@material-ui/core/ButtonBase';
import { DateRangePicker, DateRange } from '@material-ui/pickers';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import ptBrLocale from 'date-fns/locale/pt-BR';
import { FiArrowRight } from 'react-icons/fi';
import { FaSearch } from 'react-icons/fa';

import logo from '~/assets/images/logo.png';

interface HeaderProps {
  onCityChange?: (value: string) => void;
  onDateChange?: (date: DateRange) => void;
  onSearch?: () => void;
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
  citySelectFormControl: {
    width: 150,
    minWidth: 130,
  },
  dateRangeInputField: {
    maxWidth: 150,
  },
}));

const Header: React.FC<HeaderProps> = ({
  onCityChange,
  onDateChange,
  onSearch,
}) => {
  const classes = useStyles();

  const [city, setCity] = useState('');
  const [date, setDate] = useState<DateRange>([
    subDays(new Date(), 1),
    new Date(),
  ]);

  function handleCityChange(value: string): void {
    setCity(value);

    if (onCityChange) onCityChange(value);
  }

  function handleDateChange(value: DateRange): void {
    setDate(value);

    if (onDateChange) onDateChange(value);
  }

  return (
    <Box
      bgcolor="#e5e5e5"
      boxShadow={3}
      paddingTop={{ xs: 1.5, sm: 1 }}
      paddingBottom={{ xs: 2, sm: 1 }}
    >
      <Container>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
        >
          <img src={logo} alt="Logo" style={{ width: 200, paddingRight: 25 }} />

          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems="center"
          >
            {onCityChange && (
              <FormControl
                className={classNames(
                  classes.citySelectFormControl,
                  classes.fieldResponsiveContainer,
                )}
                variant="outlined"
              >
                <InputLabel id="city-select-label">Municípios</InputLabel>
                <Select
                  labelId="city-select-label"
                  id="city-select"
                  value={city}
                  onChange={(event): void =>
                    handleCityChange(event.target.value as string)}
                  label="Municípios"
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  <MenuItem value="Agua Branca">Agua Branca</MenuItem>
                  <MenuItem value="Anadia">Anadia</MenuItem>
                  <MenuItem value="Arapiraca">Arapiraca</MenuItem>
                  <MenuItem value="Atalaia">Atalaia</MenuItem>
                  <MenuItem value="Barra de Santo Antonio">
                    Barra de Santo Antonio
                  </MenuItem>
                  <MenuItem value="Barra de São Miguel">
                    Barra de São Miguel
                  </MenuItem>
                  <MenuItem value="Batalha">Batalha</MenuItem>
                  <MenuItem value="Belem">Belem</MenuItem>
                  <MenuItem value="Belo Monte">Belo Monte</MenuItem>
                  <MenuItem value="Boca da Mata">Boca da Mata</MenuItem>
                </Select>
              </FormControl>
            )}

            {onCityChange && onDateChange && (
              <Box
                bgcolor="#707070"
                height={25}
                width={3}
                borderRadius={50}
                marginX={2.5}
                display={{ xs: 'none', sm: 'block' }}
              />
            )}

            {onDateChange && (
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
                onChange={(value): void => handleDateChange(value)}
              />
            )}

            <ButtonBase
              onClick={onSearch}
              style={{ borderRadius: '50%', padding: 10, marginLeft: 20 }}
            >
              <FaSearch size={20} />
            </ButtonBase>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
