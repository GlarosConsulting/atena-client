import React, { useCallback } from 'react';
import { makeStyles, darken } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { FiArrowRight } from 'react-icons/fi';
import Text from '~/components/Text';

import { Filters } from '../index';

interface InputProps {
  parent: keyof Filters;
  id: string;
  title: string;
  value?: [string, string];
  onChange: (value: {
    [parent: string]: { [id: string]: [string, string] | undefined };
  }) => void;
  style?: React.CSSProperties;
}

const useStyles = makeStyles(theme => ({
  input: {
    borderRadius: 8,
    border: '2px solid #AAA',
    backgroundColor: 'transparent',
    padding: theme.spacing(0.5, 1),
    fontSize: 14,
    color: '#424242',
    transition: theme.transitions.create('all'),
    '&:hover': {
      borderColor: darken('#AAA', 0.15),
    },
    '&:focus': {
      borderColor: darken('#AAA', 0.3),
    },
  },
}));

const InputRange: React.FC<InputProps> = ({
  parent,
  id,
  title,
  value = ['', ''],
  onChange,
  ...rest
}) => {
  const classes = useStyles();

  const handleChange = useCallback(
    (data: [string, string]) => {
      let newValue: any = data;

      if (!newValue[0] && !newValue[1]) {
        newValue = undefined;
      }

      if (onChange) onChange({ [parent]: { [id]: newValue } });
    },
    [id, onChange, parent],
  );

  return (
    <Box display="flex" alignItems="center" marginBottom={0.6} {...rest}>
      <Text fontSize={16} fontWeight="bold" marginRight={1}>
        {`${title}: `}
      </Text>

      <input
        className={classes.input}
        type="text"
        value={value[0]}
        onChange={event => handleChange([event.target.value, value[1]])}
      />

      <FiArrowRight size={25} style={{ margin: '0 10px' }} />

      <input
        className={classes.input}
        type="text"
        value={value[1]}
        onChange={event => handleChange([value[0], event.target.value])}
      />
    </Box>
  );
};

export default InputRange;
