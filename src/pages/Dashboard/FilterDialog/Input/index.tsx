import React from 'react';
import { makeStyles, darken } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import Text from '~/components/Text';

import { Filters } from '../index';

interface InputProps {
  parent: keyof Filters;
  id: string;
  title: string;
  value?: string;
  onChange: (value: { [parent: string]: { [id: string]: string } }) => void;
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

const Input: React.FC<InputProps> = ({
  parent,
  id,
  title,
  value = '',
  onChange,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="center" marginBottom={0.6} {...rest}>
      <Text fontSize={16} fontWeight="bold" marginRight={1}>
        {`${title}: `}
      </Text>
      <input
        className={classes.input}
        type="text"
        value={value}
        onChange={event => onChange({ [parent]: { [id]: event.target.value } })}
      />
    </Box>
  );
};

export default Input;
