import React, { useMemo, useState, useEffect } from 'react';
import {
  useTheme,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import MaterialTable, { Column } from 'material-table';
import Chip from '@material-ui/core/Chip';

import { Group } from '~/@types/Session';
import api from '~/services/api';

interface GroupsProps {
  style?: React.CSSProperties;
}

const Groups: React.FC<GroupsProps> = ({ ...rest }) => {
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
      MuiChip: {
        root: {
          '&:not(:last-child)': {
            marginRight: 10,
          },
        },
      },
    },
  });

  const [data, setData] = useState<Group[]>([]);

  useEffect(() => {
    api.get<Group[]>('groups').then(response => {
      setData(response.data);
    });
  }, []);

  const columns = useMemo(
    (): Column<Group>[] => [
      { title: 'Nome', field: 'name' },
      {
        title: 'Cidades',
        field: 'cities',
        editComponent: () => <span>TO-DO</span>,
        render: row =>
          row.cities.map(city => (
            <Chip label={`${city.name} / ${city.uf}`} color="secondary" />
          )),
      },
    ],
    [],
  );

  return (
    <MuiThemeProvider theme={tableTheme}>
      <MaterialTable
        title=""
        columns={columns}
        data={data}
        localization={{
          toolbar: {
            searchPlaceholder: 'Pesquisar',
          },
          header: {
            actions: 'Ações',
          },
          body: {
            addTooltip: 'Criar novo grupo',
            editTooltip: 'Editar',
            deleteTooltip: 'Deletar',
            editRow: {
              deleteText: 'Deseja mesmo deletar este grupo?',
              saveTooltip: 'Salvar',
              cancelTooltip: 'Cancelar',
            },
          },
          pagination: { labelRowsSelect: 'grupos' },
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                // setData([...data, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                // const dataUpdate = [...data];

                // const index = oldData.tableData.id;
                // dataUpdate[index] = newData;

                // setData([...dataUpdate]);

                resolve();
              }, 1000);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                // const dataDelete = [...data];

                // const index = oldData.tableData.id;
                // dataDelete.splice(index, 1);

                // setData([...dataDelete]);

                resolve();
              }, 1000);
            }),
        }}
        options={{
          maxBodyHeight: 200,
        }}
        {...rest}
      />
    </MuiThemeProvider>
  );
};

export default Groups;
