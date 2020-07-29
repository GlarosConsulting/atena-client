import React from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import CountUp from 'react-countup';

import Text from '~/components/Text';

interface TitleObject {
  count: number;
  label: string;
}

interface CardProps {
  id?: string;
  title: TitleObject;
  value: number;
  onClick?: (event: Omit<CardProps, 'onClick'>) => void;
  className?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: lighten(theme.palette.primary.light, 0.6),
    borderRadius: 10,
    padding: 15,
    minWidth: 150,
    height: 150,
    cursor: 'default',
    transition: 'all 200ms ease',
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  hover: {
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[5],
      transform: 'translateY(-2.5px)',
    },
  },
}));

const Card: React.FC<CardProps> = ({
  id = '',
  title,
  value,
  onClick,
  className,
}) => {
  const classes = useStyles();

  return (
    <Paper
      className={classNames(className, classes.root, {
        [classes.hover]: title.count > 0 && Boolean(onClick),
      })}
      elevation={3}
      onClick={(): void => onClick && onClick({ id, title, value })}
    >
      <Box textAlign="center">
        <Text fontSize={15} fontWeight="bold">
          <CountUp end={title.count} />
        </Text>
        <Text fontSize={15} style={{ textTransform: 'uppercase' }}>
          {` ${title.label}`}
        </Text>
      </Box>

      <Text fontSize={16} fontWeight="bold" textAlign="center">
        <CountUp
          end={value}
          useEasing
          separator="."
          decimals={2}
          decimal=","
          prefix="R$ "
        />
      </Text>
    </Paper>
  );
};

export default Card;
