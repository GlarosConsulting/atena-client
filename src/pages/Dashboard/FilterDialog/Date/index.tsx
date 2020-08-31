import React, { useCallback, useState } from 'react';
import { FiTrash2, FiArrowRight } from 'react-icons/fi';

import ptBrLocale from 'date-fns/locale/pt-BR'; // eslint-disable-line

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { DateRangePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import ButtonBase from '@material-ui/core/ButtonBase';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import { MuiPickersAdapter } from '@material-ui/pickers/_shared/hooks/useUtils';

import { DateRange } from '@material-ui/pickers/DateRangePicker/RangeTypes';
import Text from '~/components/Text';

import { Filters } from '../index';

interface DateProps {
  parent: keyof Filters;
  id: string;
  title: string;
  value?: DateRange<Date>;
  onChange: (value: {
    [parent: string]: { [id: string]: DateRange<Date> };
  }) => void;
  style?: React.CSSProperties;
}

const useStyles = makeStyles(theme => ({
  trashIcon: {
    padding: theme.spacing(1),
    borderRadius: '50%',
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  dateRangeInputField: {
    maxWidth: 150,
    '& > div': {
      height: 28,
      '& > fieldset': {
        borderWidth: 2,
        borderColor: '#AAA',
      },
    },
  },
}));

const Date: React.FC<DateProps> = ({
  parent,
  id,
  title,
  value = [null, null],
  onChange,
  ...rest
}) => {
  const classes = useStyles();

  const [date, setDate] = useState<DateRange<Date>>(value);

  const handleChange = useCallback(
    (newDate: DateRange<Date>) => {
      setDate(newDate);

      let newValue: any = newDate;

      if (!newValue[0] && !newValue[1]) {
        newValue = undefined;
      }

      if (onChange) onChange({ [parent]: { [id]: newValue } });
    },
    [onChange, parent, id],
  );

  return (
    <Box display="flex" alignItems="center" marginBottom={0.6} {...rest}>
      <Text fontSize={16} fontWeight="bold" marginRight={1}>
        {`${title}: `}
      </Text>

      <DateRangePicker
        startText="Início"
        endText="Fim"
        value={date}
        dateAdapter={
          (new DateFnsAdapter({
            locale: ptBrLocale,
          }) as unknown) as MuiPickersAdapter<DateRange<Date>>
        }
        renderInput={(startProps, endProps): React.ReactElement => (
          <Box display="flex" alignItems="center">
            <TextField
              className={classes.dateRangeInputField}
              {...startProps}
              label=""
              helperText=""
            />

            <FiArrowRight size={25} style={{ margin: '0 10px' }} />

            <TextField
              className={classes.dateRangeInputField}
              {...endProps}
              label=""
              helperText=""
            />
          </Box>
        )}
        onChange={newDate => handleChange(newDate)}
      />

      <ButtonBase
        className={classes.trashIcon}
        onClick={() => handleChange([null, null])}
      >
        <FiTrash2 color="#505050" />
      </ButtonBase>
    </Box>
  );
};

export default Date;
