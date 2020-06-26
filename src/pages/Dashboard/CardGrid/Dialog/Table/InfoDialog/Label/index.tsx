import React from 'react';
import Box from '@material-ui/core/Box';

import Text from '~/components/Text';

interface LabelProps {
  title: string;
  value?: string | number;
}

const Label: React.FC<LabelProps> = ({ title, value }) =>
  value ? (
    <Box marginBottom={0.6}>
      <Text variant="body1" fontSize={16} textAlign="justify">
        <Text fontSize={16} fontWeight="bold">{`${title}: `}</Text>
        {value}
      </Text>
    </Box>
  ) : null;

export default Label;
