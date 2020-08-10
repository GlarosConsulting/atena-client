import React, { useCallback } from 'react';
import { FiTrash2 } from 'react-icons/fi';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { DatePicker } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import ButtonBase from '@material-ui/core/ButtonBase';

import Text from '~/components/Text';

import { Filters } from '../index';

interface DateProps {
  parent: keyof Filters;
  id: string;
  title: string;
  value?: Date;
  onChange: (value: {
    [parent: string]: { [id: string]: string | Date | null };
  }) => void;
  style?: React.CSSProperties;
}

const useStyles = makeStyles(theme => ({
  input: {
    width: 200,
    '& input': {
      padding: '5px 14px',
    },
    '& fieldset': {
      borderWidth: 2,
      borderColor: '#AAA',
    },
    '& .MuiSvgIcon-root': {
      width: '0.8em',
    },
  },
  trashIcon: {
    padding: theme.spacing(1),
    borderRadius: '50%',
    marginLeft: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
}));

const Date: React.FC<DateProps> = ({
  parent,
  id,
  title,
  value = '',
  onChange,
  ...rest
}) => {
  const classes = useStyles();

  const handleChange = useCallback(
    (data: string | Date | null) => {
      if (onChange) onChange({ [parent]: { [id]: data } });
    },
    [onChange, parent, id],
  );

  return (
    <Box display="flex" alignItems="center" marginBottom={0.6} {...rest}>
      <Text fontSize={16} fontWeight="bold" marginRight={1}>
        {`${title}: `}
      </Text>
      <DatePicker
        clearable
        clearText="Limpar"
        value={value || null}
        renderInput={props => (
          <TextField
            {...props}
            className={classes.input}
            variant="outlined"
            helperText={null}
          />
        )}
        onChange={date => handleChange(date)}
      />

      <ButtonBase
        className={classes.trashIcon}
        onClick={() => handleChange(null)}
      >
        <FiTrash2 color="#505050" />
      </ButtonBase>
    </Box>
  );
};

export default Date;
