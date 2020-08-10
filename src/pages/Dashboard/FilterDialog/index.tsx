import React, { useState, useCallback } from 'react';

import merge from 'lodash/merge';
import ptBrLocale from 'date-fns/locale/pt-BR';

import { makeStyles, darken } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import { LocalizationProvider } from '@material-ui/pickers';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';

import Statistics from '~/@types/Statistics';
import Agreement from '~/@types/Agreement';

import api from '~/services/api';

import Dialog from '~/components/Dialog';
import DialogTitle from '~/components/Dialog/Title';
import DialogContent from '~/components/Dialog/Content';
import DialogActions from '~/components/Dialog/Actions';
import DialogButton from '~/components/Dialog/Button';
import Text from '~/components/Text';
import Loading from '~/components/Loading';

import Input from './Input';
import Date from '~/pages/Dashboard/FilterDialog/Date';

interface InfoDialogProps {
  open: boolean;
  data: object;
  onChange?: (filters: Filters) => void;
  onClose: () => void;
}

export interface Filters {
  celebration?: {
    agreementId?: string;
    modality?: string;
    processId?: string;
    proposalId?: string;
    proposalDate?: Date;
    biddingDate?: Date;
    homologationDate?: Date;
    legalFoundation?: string;
    value?: string;
    description?: string;
    object?: string;
  };
  execution?: {
    executionId?: string;
    type?: string;
    date?: Date;
    processId?: string;
    status?: string;
    systemStatus?: string;
    system?: string;
    accepted?: string;
  };
  accountability?: {
    organ?: string;
    convenient?: string;
    documentNumber?: string;
    modality?: string;
    status?: string;
    number?: string;
    validity?: string;
    limitDate?: Date;
    totalValue?: string;
    transferValue?: string;
    counterpartValue?: string;
    yieldValue?: string;
  };
}

interface FiltersResponse {
  statistics: Statistics;
  agreements: Agreement[];
}

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.palette.primary.light,
    borderRadius: 8,
    padding: theme.spacing(1, 2),
    '&:not(:last-child)': {
      marginBottom: 10,
    },
  },
  expandButton: {
    padding: theme.spacing(0.65, 1.25),
    backgroundColor: darken(theme.palette.primary.light, 0.1),
    borderRadius: 10,
    fontSize: 12,
    color: darken(theme.palette.primary.light, 0.65),
  },
}));

const FilterDialog: React.FC<InfoDialogProps> = ({
  open,
  data,
  onChange,
  onClose,
}) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState<string>();

  const [filters, setFilters] = useState<Filters>({});

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateFilters = useCallback(
    (value: {
      [parent: string]: { [id: string]: string | Date | null | undefined };
    }) => {
      let newFilters = merge(filters, value) as Filters;

      function cleanEmptyValues<T>(_object: T) {
        const object: { [key: string]: any } = { ..._object };

        Object.keys(_object).forEach(_key => {
          const key = _key;
          const val = object[key];

          try {
            if (val && typeof val === 'object' && !(val instanceof Date)) {
              object[key] = cleanEmptyValues(val);
              return;
            }
          } catch {} // eslint-disable-line

          if (!val) delete object[key];
        });

        return object;
      }

      newFilters = cleanEmptyValues(newFilters);

      setFilters(newFilters);

      if (onChange) onChange(newFilters);
    },
    [filters, onChange],
  );

  const handleCheck = useCallback(() => {
    console.log(filters);

    setIsLoading(true);

    api
      .post<FiltersResponse>('filters', { filters }, { params: data })
      .then(response => {
        setAgreements(response.data.agreements);
        setIsLoading(false);
      });
  }, [filters, data]);

  return (
    <>
      <Dialog open={open} responsive maxWidth="sm" fullWidth onClose={onClose}>
        <DialogTitle onClose={onClose}>Filtrar</DialogTitle>
        <DialogContent dividers>
          <LocalizationProvider
            dateAdapter={DateFnsAdapter}
            locale={ptBrLocale}
          >
            <Paper className={classes.container}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width={1}
              >
                <Text fontSize={18} fontWeight={400}>
                  Celebração
                </Text>

                <Button
                  className={classes.expandButton}
                  variant="contained"
                  disableElevation
                  onClick={(): void =>
                    expanded !== 'celebration'
                      ? setExpanded('celebration')
                      : setExpanded(undefined)
                  }
                >
                  {expanded === 'celebration'
                    ? 'Mostrar menos'
                    : 'Mostrar mais'}
                </Button>
              </Box>

              <Collapse
                in={expanded === 'celebration'}
                collapsedHeight={65}
                style={{
                  marginTop: 10,
                }}
              >
                <Input
                  parent="celebration"
                  id="agreementId"
                  title="Número do convênio"
                  value={filters.celebration?.agreementId}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="celebration"
                  id="modality"
                  title="Modalidade"
                  value={filters.celebration?.modality}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="celebration"
                  id="processId"
                  title="Número do processo"
                  value={filters.celebration?.processId}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="celebration"
                  id="proposalId"
                  title="Número do edital"
                  value={filters.celebration?.proposalId}
                  onChange={handleUpdateFilters}
                />
                <Date
                  parent="celebration"
                  id="proposalDate"
                  title="Data de publicação"
                  value={filters.celebration?.proposalDate}
                  onChange={handleUpdateFilters}
                />
                <Date
                  parent="celebration"
                  id="biddingDate"
                  title="Data de licitação"
                  value={filters.celebration?.biddingDate}
                  onChange={handleUpdateFilters}
                />
                <Date
                  parent="celebration"
                  id="homologationDate"
                  title="Data de homologação"
                  value={filters.celebration?.homologationDate}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="celebration"
                  id="legalFoundation"
                  title="Referência legal"
                  value={filters.celebration?.legalFoundation}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="celebration"
                  id="value"
                  title="Valor"
                  value={filters.celebration?.value}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="celebration"
                  id="description"
                  title="Descrição"
                  value={filters.celebration?.description}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="celebration"
                  id="object"
                  title="Objeto"
                  value={filters.celebration?.object}
                  onChange={handleUpdateFilters}
                />
              </Collapse>
            </Paper>

            <Paper className={classes.container}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width={1}
              >
                <Text fontSize={18} fontWeight={400}>
                  Execução
                </Text>

                <Button
                  className={classes.expandButton}
                  variant="contained"
                  disableElevation
                  onClick={(): void =>
                    expanded !== 'execution'
                      ? setExpanded('execution')
                      : setExpanded(undefined)
                  }
                >
                  {expanded === 'execution' ? 'Mostrar menos' : 'Mostrar mais'}
                </Button>
              </Box>

              <Collapse
                in={expanded === 'execution'}
                collapsedHeight={65}
                style={{
                  marginTop: 10,
                }}
              >
                <Input
                  parent="execution"
                  id="executionId"
                  title="Número"
                  value={filters.execution?.executionId}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="execution"
                  id="type"
                  title="Tipo"
                  value={filters.execution?.type}
                  onChange={handleUpdateFilters}
                />
                <Date
                  parent="execution"
                  id="date"
                  title="Data de publicação"
                  value={filters.execution?.date}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="execution"
                  id="processId"
                  title="Número do processo"
                  value={filters.execution?.processId}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="execution"
                  id="status"
                  title="Situação"
                  value={filters.execution?.status}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="execution"
                  id="systemStatus"
                  title="Situação no sistema de origem"
                  value={filters.execution?.systemStatus}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="execution"
                  id="system"
                  title="Sistema de origem"
                  value={filters.execution?.system}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="execution"
                  id="accepted"
                  title="Aceite"
                  value={filters.execution?.accepted}
                  onChange={handleUpdateFilters}
                />
              </Collapse>
            </Paper>

            <Paper className={classes.container}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width={1}
              >
                <Text fontSize={18} fontWeight={400}>
                  Prestação de contas
                </Text>

                <Button
                  className={classes.expandButton}
                  variant="contained"
                  disableElevation
                  onClick={(): void =>
                    expanded !== 'accountability'
                      ? setExpanded('accountability')
                      : setExpanded(undefined)
                  }
                >
                  {expanded === 'accountability'
                    ? 'Mostrar menos'
                    : 'Mostrar mais'}
                </Button>
              </Box>

              <Collapse
                in={expanded === 'accountability'}
                collapsedHeight={65}
                style={{
                  marginTop: 10,
                }}
              >
                <Input
                  parent="accountability"
                  id="organ"
                  title="Órgão concedente"
                  value={filters.accountability?.organ}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="convenient"
                  title="Convenente/Contratado"
                  value={filters.accountability?.convenient}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="documentNumber"
                  title="CNPJ"
                  value={filters.accountability?.documentNumber}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="modality"
                  title="Modalidade"
                  value={filters.accountability?.modality}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="status"
                  title="Situação"
                  value={filters.accountability?.status}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="number"
                  title="Número"
                  value={filters.accountability?.number}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="validity"
                  title="Vigência"
                  value={filters.accountability?.validity}
                  onChange={handleUpdateFilters}
                />
                <Date
                  parent="accountability"
                  id="limitDate"
                  title="Data limite"
                  value={filters.accountability?.limitDate}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="totalValue"
                  title="Valor total"
                  value={filters.accountability?.totalValue}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="transferValue"
                  title="Valor do repasse"
                  value={filters.accountability?.transferValue}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="counterpartValue"
                  title="Valor de contrapartida"
                  value={filters.accountability?.counterpartValue}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="yieldValue"
                  title="Valor de rendimento"
                  value={filters.accountability?.yieldValue}
                  onChange={handleUpdateFilters}
                />
              </Collapse>
            </Paper>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions>
          <Text fontSize={16} fontWeight={400} marginRight="auto">
            {`${agreements.length} convênios encontrados`}
          </Text>

          <DialogButton variant="outlined" onClick={() => setFilters({})}>
            <Text fontSize={17} fontWeight={800} color="#777">
              LIMPAR
            </Text>
          </DialogButton>
          <DialogButton variant="contained" onClick={handleCheck}>
            <Text fontSize={17} fontWeight={800} color="#FFF">
              VALIDAR
            </Text>
          </DialogButton>
        </DialogActions>
      </Dialog>

      <Loading open={isLoading} />
    </>
  );
};

export default FilterDialog;
