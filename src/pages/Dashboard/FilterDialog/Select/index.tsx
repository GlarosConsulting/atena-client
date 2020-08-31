import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  FormControl,
  Select as MuiSelect,
  MenuItem,
} from '@material-ui/core';

import Text from '~/components/Text';

import { Filters } from '../index';

interface InputProps {
  parent: keyof Filters;
  id: string;
  title: string;
  value?: string;
  options: string[];
  onChange: (value: { [parent: string]: { [id: string]: string } }) => void;
  style?: React.CSSProperties;
}

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: 198,
    '& > div': {
      height: 28,
      '& > fieldset': {
        borderWidth: 2,
        borderColor: '#AAA',
      },
    },
  },
}));

const Select: React.FC<InputProps> = ({
  parent,
  id,
  title,
  value = '',
  options = [],
  onChange,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center" marginBottom={0.6} {...rest}>
      <Text fontSize={16} fontWeight="bold" marginRight={1}>
        {`${title}: `}
      </Text>
      <FormControl variant="outlined" className={classes.formControl}>
        <MuiSelect
          id={`${id}-outlined`}
          value={value}
          onChange={event =>
            onChange({ [parent]: { [id]: event.target.value as string } })
          }
        >
          <MenuItem value="">
            <em>Nenhum</em>
          </MenuItem>
          {options.map(option => (
            <MenuItem value={option}>{option}</MenuItem>
          ))}
        </MuiSelect>
      </FormControl>
    </Box>
  );
};

export default Select;
