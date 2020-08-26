import React, { useState, useCallback } from 'react';

import _ from 'lodash';
import ptBrLocale from 'date-fns/locale/pt-BR';

import { makeStyles, darken } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { LocalizationProvider } from '@material-ui/pickers';
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';

import { DateRange } from '@material-ui/pickers/DateRangePicker/RangeTypes';
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
import InputRange from './InputRange';
import MuiSelect from './Select';
import Date from './Date';
import Switch from '~/components/Switch';

interface InfoDialogProps {
  open: boolean;
  data: object;
  onChange(filters: Filters): void;
  onToggleOnlyAlerts(active: boolean): void;
  onClose(): void;
}

type ValueRange = [string, string];

export interface Filters {
  celebration?: {
    agreementId?: string;
    modality?: string;
    processId?: string;
    proposalId?: string;
    proposalDate?: DateRange<Date>;
    biddingDate?: DateRange<Date>;
    homologationDate?: DateRange<Date>;
    legalFoundation?: string;
    value?: ValueRange;
    description?: string;
    object?: string;
  };
  execution?: {
    executionId?: string;
    type?: string;
    date?: DateRange<Date>;
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
    validity?: DateRange<Date>;
    limitDate?: DateRange<Date>;
    totalValue?: ValueRange;
    transferValue?: ValueRange;
    counterpartValue?: ValueRange;
    yieldValue?: ValueRange;
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
  switchLabel: {
    marginRight: 6,
  },
}));

const FilterDialog: React.FC<InfoDialogProps> = ({
  open,
  data,
  onChange,
  onToggleOnlyAlerts,
  onClose,
}) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState<string>();

  const [filters, setFilters] = useState<Filters>({});
  const [isActiveOnlyAlerts, setOnlyAlerts] = useState(false);

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateFilters = useCallback(
    (value: {
      [parent: string]: {
        [id: string]: string | DateRange<Date> | ValueRange | null | undefined;
      };
    }) => {
      const newFilters = _.assign(filters, value) as Filters;

      setFilters(newFilters);

      onChange(newFilters);
    },
    [filters, onChange],
  );

  const handleToggleOnlyAlerts = useCallback(() => {
    const newValue = !isActiveOnlyAlerts;

    setOnlyAlerts(newValue);

    onToggleOnlyAlerts(newValue);
  }, [isActiveOnlyAlerts, onToggleOnlyAlerts]);

  const handleClear = useCallback(() => {
    setFilters({});

    onChange({});
  }, [onChange]);

  const handleCheck = useCallback(() => {
    setIsLoading(true);

    api
      .post<FiltersResponse>(
        'filters',
        {
          filters,
        },
        {
          params: data,
        },
      )
      .then(response => {
        setAgreements(response.data.agreements);
        setIsLoading(false);
      });
  }, [filters, data]);

  return (
    <>
      <Dialog open={open} responsive maxWidth="md" fullWidth onClose={onClose}>
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
                <MuiSelect
                  parent="celebration"
                  id="modality"
                  title="Modalidade"
                  value={filters.celebration?.modality}
                  options={['Contrato de Repasse']}
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
                <InputRange
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
                <MuiSelect
                  parent="execution"
                  id="type"
                  title="Tipo"
                  value={filters.execution?.type}
                  options={['Tipo']}
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
                <MuiSelect
                  parent="execution"
                  id="status"
                  title="Situação"
                  value={filters.execution?.status}
                  options={['Situação']}
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
                <MuiSelect
                  parent="accountability"
                  id="modality"
                  title="Modalidade"
                  value={filters.accountability?.modality}
                  options={['Modalidade']}
                  onChange={handleUpdateFilters}
                />
                <MuiSelect
                  parent="accountability"
                  id="status"
                  title="Situação"
                  value={filters.accountability?.status}
                  options={['Situação']}
                  onChange={handleUpdateFilters}
                />
                <Input
                  parent="accountability"
                  id="number"
                  title="Número"
                  value={filters.accountability?.number}
                  onChange={handleUpdateFilters}
                />
                <Date
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
                <InputRange
                  parent="accountability"
                  id="totalValue"
                  title="Valor total"
                  value={filters.accountability?.totalValue}
                  onChange={handleUpdateFilters}
                />
                <InputRange
                  parent="accountability"
                  id="transferValue"
                  title="Valor do repasse"
                  value={filters.accountability?.transferValue}
                  onChange={handleUpdateFilters}
                />
                <InputRange
                  parent="accountability"
                  id="counterpartValue"
                  title="Valor de contrapartida"
                  value={filters.accountability?.counterpartValue}
                  onChange={handleUpdateFilters}
                />
                <InputRange
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

          <FormControlLabel
            control={
              <Switch
                checked={isActiveOnlyAlerts}
                onChange={handleToggleOnlyAlerts}
              />
            }
            label="Apenas alertas"
            labelPlacement="start"
            classes={{
              label: classes.switchLabel,
            }}
            style={{ marginRight: 8 }}
          />
          <DialogButton variant="outlined" onClick={handleClear}>
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
