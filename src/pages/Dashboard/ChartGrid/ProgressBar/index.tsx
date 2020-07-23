import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';

import Text from '~/components/Text';

interface ProgressBarProps {
  className?: string;
  title: string;
  value: number;
  percentage: number;
}

const useStyles = makeStyles({
  linearProgress: {
    height: 15,
  },
});

const ProgressBar: React.FC<ProgressBarProps> = ({
  className,
  title,
  value,
  percentage,
}) => {
  const classes = useStyles();

  return (
    <Box className={className} width={1}>
      <Box display="flex" justifyContent="space-between">
        <Text fontSize={14} color="#404040" marginLeft={1}>
          {title}
        </Text>
        <Text fontSize={14} color="#505050" marginRight={1}>
          {value}
        </Text>
      </Box>
      <LinearProgress
        className={classes.linearProgress}
        variant="determinate"
        value={percentage}
      />
    </Box>
  );
};

export default ProgressBar;
