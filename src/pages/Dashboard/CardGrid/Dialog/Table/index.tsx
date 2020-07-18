import React, { useState, useMemo } from 'react';
import {
  useTheme,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import Box from '@material-ui/core/Box';
import ButtonBase from '@material-ui/core/ButtonBase';
import { FaPlus } from 'react-icons/fa';
import MaterialTable, { Column } from 'material-table';

import Agreement from '~/@types/Agreement';

import getTimeZone from '~/utils/getTimeZone';

import InfoDialog from './InfoDialog';

interface TableProps {
  data: Agreement[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  const theme = useTheme();
  const tableTheme = createMuiTheme({
    ...theme,
    overrides: {
      MuiPaper: {
        root: {
          backgroundColor: theme.palette.primary.light,
        },
        rounded: {
          borderRadius: 10,
        },
        elevation2: {
          boxShadow: theme.shadows[3],
        },
      },
      MuiTableCell: {
        head: {
          '&[class*="MTableHeader"]': {
            backgroundColor: theme.palette.primary.light,
          },
        },
      },
    },
  });

  const [agreement, setAgreement] = useState<Agreement | null>();

  const columns = useMemo(
    (): Column<Agreement>[] => [
      {
        title: 'Visualizar',
        render: row => (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={1}
          >
            <ButtonBase
              onClick={(): void => setAgreement(row)}
              style={{ padding: 10, borderRadius: '50%' }}
            >
              <FaPlus size={15} />
            </ButtonBase>
          </Box>
        ),
        headerStyle: { maxWidth: 100 },
      },
      { title: 'Convênio', field: 'agreementId' },
      { title: 'Orgão', field: 'name', headerStyle: { minWidth: 175 } },
      { title: 'Situação', field: 'status', headerStyle: { minWidth: 175 } },
      {
        title: 'Data de início',
        field: 'beginDate',
        type: 'date',
        render: (row): string =>
          format(utcToZonedTime(row.start, getTimeZone()), 'dd/MM/yyyy'),
        headerStyle: { minWidth: 145 },
      },
      {
        title: 'Data de fim',
        field: 'endDate',
        type: 'date',
        render: (row): string =>
          format(utcToZonedTime(row.end, getTimeZone()), 'dd/MM/yyyy'),
        headerStyle: { minWidth: 145 },
      },
      { title: 'Programa', field: 'program', cellStyle: { minWidth: 500 } },
    ],
    [],
  );

  return (
    <>
      <MuiThemeProvider theme={tableTheme}>
        <MaterialTable
          title=""
          columns={columns}
          data={data}
          localization={{ pagination: { labelRowsSelect: 'convênios' } }}
        />
      </MuiThemeProvider>

      <InfoDialog
        open={Boolean(agreement)}
        agreement={agreement}
        onClose={(): void => setAgreement(null)}
      />
    </>
  );
};

export default Table;
