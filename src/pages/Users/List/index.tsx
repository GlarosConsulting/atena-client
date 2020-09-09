import React, { useMemo, useState, useEffect } from 'react';
import {
  useTheme,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import MaterialTable, { Column } from 'material-table';

import { User } from '~/@types/Session';
import api from '~/services/api';

interface ListProps {
  style?: React.CSSProperties;
}

const List: React.FC<ListProps> = ({ ...rest }) => {
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

  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<User[]>([]);
  const [groupsAsLookup, setGroupsAsLookup] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    api.get('users').then(response => {
      setData(response.data);
    });

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
        initialEditValue: '',
      },
      {
        title: 'Situação',
        field: 'active',
        lookup: {
          true: 'Ativo',
          false: 'Desativado',
        },
        initialEditValue: true,
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
          onRowAdd: async newData => {
            const requestData = {
              name: newData.name,
              username: newData.username,
              email: newData.email,
              groupId: newData.group?.id,
            };

            try {
              await api.post(`users`, requestData);

              setData([...data, newData]);
            } catch (err) {
              const statusCode = (err.response
                ? err.response.status
                : 200) as number;

              if (statusCode === 409) {
                const error = (err.response.data.error as string).toLowerCase();

                if (error.includes('username')) {
                  enqueueSnackbar('Usuário em uso.', {
                    variant: 'error',
                  });
                } else if (error.includes('e-mail')) {
                  enqueueSnackbar('E-mail em uso.', {
                    variant: 'error',
                  });
                } else {
                  enqueueSnackbar('Preencha os campos corretamente.', {
                    variant: 'error',
                  });
                }
              } else if (statusCode === 400) {
                const error = (err.response.data
                  .message as string).toLowerCase();

                if (error.includes('email')) {
                  enqueueSnackbar('E-mail inválido', {
                    variant: 'error',
                  });
                } else {
                  enqueueSnackbar('Preencha os campos corretamente.', {
                    variant: 'error',
                  });
                }
              }
            }
          },
          onRowUpdate: async (newData, oldData) => {
            if (!oldData) return;

            const requestData = {
              name: newData.name,
              username: newData.username,
              email: newData.email,
              groupId: newData.group?.id,
            };

            try {
              await api.put(`users/${oldData.id}`, requestData);

              const dataUpdate = [...data];

              const index = data.findIndex(el => el.id === oldData.id);
              dataUpdate[index] = newData;

              setData([...dataUpdate]);
            } catch (err) {
              const error = (err.response.data.error as string).toLowerCase();

              if (error.includes('username')) {
                enqueueSnackbar('Usuário em uso.', {
                  variant: 'error',
                });
              } else if (error.includes('e-mail')) {
                enqueueSnackbar('E-mail em uso.', {
                  variant: 'error',
                });
              } else {
                enqueueSnackbar('Preencha os campos corretamente.', {
                  variant: 'error',
                });
              }
            }
          },
          onRowDelete: async oldData => {
            await api.delete(`users/${oldData.id}`);

            const newData = [...data];

            const index = data.findIndex(el => el.id === oldData.id);
            newData.splice(index, 1);

            setData([...newData]);
          },
        }}
        options={{
          maxBodyHeight: 200,
        }}
        {...rest}
      />
    </MuiThemeProvider>
  );
};

export default List;
