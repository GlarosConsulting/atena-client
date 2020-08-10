import React, { useMemo, useState, useEffect } from 'react';
import {
  useTheme,
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import MaterialTable, { Column } from 'material-table';
import Chip from '@material-ui/core/Chip';

import { Group, City } from '~/@types/Session';
import api from '~/services/api';

interface GroupingsProps {
  style?: React.CSSProperties;
}

const Groupings: React.FC<GroupingsProps> = ({ ...rest }) => {
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
        root: {
          padding: 8,
        },
        head: {
          '&[class*="MTableHeader"]': {
            backgroundColor: theme.palette.primary.light,
          },
        },
      },
      MuiChip: {
        root: {
          marginTop: 2.5,
          marginBottom: 2.5,
          '&:not(:last-child)': {
            marginRight: 10,
          },
        },
      },
    },
  });

  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<Group[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    api.get<Group[]>('groups').then(response => {
      setData(response.data);
    });

    api.get<City[]>('cities').then(response => {
      setCities(response.data);
    });
  }, []);

  const columns = useMemo(
    (): Column<Group>[] => [
      { title: 'Nome', field: 'name' },
      {
        title: 'Acesso',
        field: 'access',
        lookup: {
          ANY: 'Qualquer esfera e município',
          MUNICIPAL_SPHERE: 'Esfera municipal',
          STATE_SPHERE: 'Esfera estadual',
          CITIES: 'Municipios especifícos',
        },
      },
      {
        title: 'Municípios',
        field: 'cities',
        editComponent: ({ value, onChange, rowData }) => {
          if (rowData.access !== 'CITIES') return <></>;

          const selected = value ? (value as City[]).map(city => city.id) : [];

          return (
            <FormControl style={{ minWidth: 150 }}>
              <InputLabel id="cities-select-label">Cidades</InputLabel>
              <Select
                labelId="cities-select-label"
                multiple
                value={selected}
                onChange={event => {
                  const dataUpdate: City[] = [];

                  (event.target.value as string[]).forEach(cityId => {
                    const city = cities.find(el => el.id === cityId);

                    if (city) dataUpdate.push(city);
                  });

                  onChange([...dataUpdate]);
                }}
                input={<Input />}
                renderValue={() => {
                  const cityNames = selected.map(cityId => {
                    const city = cities.find(el => el.id === cityId);

                    return city ? city.name : 'NOT_FOUND';
                  });

                  if (cityNames.length >= 4) {
                    cityNames.length = 4;
                    cityNames[3] = '...';
                  }

                  return cityNames.join(', ');
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8,
                      width: 250,
                    },
                  },
                }}
              >
                {cities.map(city => (
                  <MenuItem key={city.id} value={city.id}>
                    <Checkbox checked={selected.includes(city.id)} />
                    <ListItemText primary={`${city.name} / ${city.uf}`} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
        render: row =>
          row.cities.map(city => (
            <Chip label={`${city.name} / ${city.uf}`} color="secondary" />
          )),
      },
    ],
    [cities],
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
            emptyDataSourceMessage: 'Nenhum grupo',
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
          onRowAdd: async newData => {
            const requestData = {
              name: newData.name,
              access: newData.access,
              cityIds:
                newData.cities && newData.cities.length > 0
                  ? newData.cities.map(city => city.id)
                  : undefined,
            };

            try {
              const response = await api.post('groups', requestData);

              setData([...data, response.data]);
            } catch {
              enqueueSnackbar('Preecha os campos corretamente.', {
                variant: 'error',
              });
            }
          },
          onRowUpdate: async (_newData, oldData) => {
            if (!oldData) return;

            const newData = _newData;

            if (newData.access !== 'CITIES') {
              newData.cities = [];
            }

            const requestData = {
              name: newData.name,
              access: newData.access,
              cityIds: newData.cities.map(city => city.id),
            };

            try {
              await api.put(`groups/${oldData.id}`, requestData);

              const dataUpdate = [...data];

              const index = data.findIndex(el => el.id === oldData.id);
              dataUpdate[index] = newData;

              setData([...dataUpdate]);
            } catch {
              enqueueSnackbar('Preecha os campos corretamente.', {
                variant: 'error',
              });
            }
          },
          onRowDelete: async oldData => {
            await api.delete(`groups/${oldData.id}`);

            const dataDelete = [...data];

            const index = data.findIndex(el => el.id === oldData.id);
            dataDelete.splice(index, 1);

            setData([...dataDelete]);
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

export default Groupings;
