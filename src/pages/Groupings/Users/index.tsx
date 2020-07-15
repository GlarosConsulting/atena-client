import React, { useMemo, useState, useEffect } from 'react';
import {
  useTheme,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import MaterialTable, { Column } from 'material-table';

import { User } from '~/@types/Session';
import api from '~/services/api';

interface UsersProps {
  style?: React.CSSProperties;
}

const Users: React.FC<UsersProps> = ({ ...rest }) => {
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

  const [data, setData] = useState<User[]>([
    {
      id: 'dawda',
      name: 'Teste',
      username: 'testing',
      email: 'test@test.com',
      group: {
        id: 'e3fb18a9-9156-4e35-a094-a11a22662d6f',
        name: 'Test',
        cities: [
          {
            id: 'eade0b32-5043-4546-a9fd-7b8604cb46e8',
            name: 'Maragogi',
            uf: 'AL',
            ibge: '2704500',
          },
        ],
      },
    },
  ]);
  const [groupsAsLookup, setGroupsAsLookup] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    api.get('groups/lookup').then(response => {
      setGroupsAsLookup(response.data);
    });
  }, []);

  const columns = useMemo(
    (): Column<User>[] => [
      { title: 'Nome', field: 'name' },
      { title: 'Usuário', field: 'username' },
      { title: 'E-mail', field: 'email' },
      {
        title: 'Grupo',
        field: 'group.id',
        lookup: groupsAsLookup,
      },
    ],
    [groupsAsLookup],
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
            emptyDataSourceMessage: 'Nenhum usuário',
            addTooltip: 'Adicionar novo usuário',
            editTooltip: 'Editar',
            deleteTooltip: 'Deletar',
            editRow: {
              deleteText: 'Deseja mesmo deletar este usuário?',
              saveTooltip: 'Salvar',
              cancelTooltip: 'Cancelar',
            },
          },
          pagination: { labelRowsSelect: 'usuários' },
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setData([...data, newData]);

              resolve();
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              if (!oldData) {
                reject();
                return;
              }

              const dataUpdate = [...data];

              const index = data.findIndex(el => el.id === oldData.id);
              dataUpdate[index] = newData;

              setData([...dataUpdate]);

              resolve();
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              const newData = [...data];

              const index = data.findIndex(el => el.id === oldData.id);
              newData.splice(index, 1);

              setData([...newData]);

              resolve();
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

export default Users;
