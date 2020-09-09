import React, { useState } from 'react';
import { makeStyles, darken } from '@material-ui/core/styles';
import format from 'date-fns/format';
import { utcToZonedTime } from 'date-fns-tz';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { FiInfo } from 'react-icons/fi';
import Agreement, { Program, ExecutionProcess } from '~/@types/Agreement';

import getTimeZone from '~/utils/getTimeZone';
import formatValue from '~/utils/formatValue';

import Dialog from '~/components/Dialog';
import DialogTitle from '~/components/Dialog/Title';
import DialogContent from '~/components/Dialog/Content';
import Text from '~/components/Text';

import Label from './Label';
import ProgramDetailsDialog from './ProgramDetailsDialog';
import ExecutionProcessDetailsDialog from './ExecutionProcessDetailsDialog';
import formatDate from '~/utils/formatDate';

interface InfoDialogProps {
  open: boolean;
  agreement?: Agreement | null;
  onClose: () => void;
}

const useStyles = makeStyles(theme => ({
  collapseContainer: {
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

const InfoDialog: React.FC<InfoDialogProps> = ({
  open,
  agreement,
  onClose,
}) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState<string>();

  const [program, setProgram] = useState<Program | null>();
  const [
    executionProcess,
    setExecutionProcess,
  ] = useState<ExecutionProcess | null>();

  return agreement ? (
    <>
      <Dialog open={open} responsive maxWidth="md" fullWidth onClose={onClose}>
        <DialogTitle onClose={onClose}>Informações</DialogTitle>
        <DialogContent dividers>
          <Paper className={classes.collapseContainer}>
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
                {expanded === 'celebration' ? 'Mostrar menos' : 'Mostrar mais'}
              </Button>
            </Box>

            <Collapse
              in={expanded === 'celebration'}
              collapsedHeight={60}
              style={{
                marginTop: 10,
              }}
            >
              <Label title="Número do convênio" value={agreement.agreementId} />
              <Label
                title="Modalidade"
                value={agreement.proposalData.data.modality}
              />
              <Label
                title="Número do processo"
                value={agreement.proposalData.data.proccessId}
              />
              <Label
                title="Número do edital"
                value={agreement.proposalData.data.proposalId}
              />
              <Label
                title="Data de publicação"
                value={format(
                  utcToZonedTime(
                    agreement.proposalData.data.proposalDate,
                    getTimeZone(),
                  ),
                  'dd/MM/yyyy',
                )}
              />
              <Label
                title="Data de licitação"
                value={format(
                  utcToZonedTime(
                    agreement.proposalData.data.biddingDate,
                    getTimeZone(),
                  ),
                  'dd/MM/yyyy',
                )}
              />
              <Label
                title="Data de homologação"
                value={format(
                  utcToZonedTime(
                    agreement.proposalData.data.homologationDate,
                    getTimeZone(),
                  ),
                  'dd/MM/yyyy',
                )}
              />
              <Label
                title="Referência legal"
                value={agreement.proposalData.data.legalFoundation}
              />
              <Label
                title="Valor"
                value={Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(
                  agreement.proposalData.programs.reduce(
                    (accumulator, el) => accumulator + el.value,
                    0,
                  ),
                )}
              />
              <Label
                title="Descrição"
                value={agreement.proposalData.data.description}
              />
              <Label
                title="Objeto"
                value={agreement.proposalData.data.object}
              />

              <Text fontSize={16} fontWeight="bold">
                Programas
              </Text>
              <TableContainer component={Paper} style={{ margin: '5px 0' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Nome</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Detalhes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agreement.proposalData.programs.map(el => (
                      <TableRow>
                        <TableCell>{el.programId}</TableCell>
                        <TableCell>{el.name}</TableCell>
                        <TableCell>{formatValue(el.value)}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => setProgram(el)}
                          >
                            <FiInfo size={18} color="#424242" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </Paper>

          <Paper className={classes.collapseContainer}>
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
              collapsedHeight={80}
              style={{
                marginTop: 10,
              }}
            >
              <TableContainer component={Paper} style={{ margin: '5px 0' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Número</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Data de publicação</TableCell>
                      <TableCell>Número do processo</TableCell>
                      <TableCell>Situação</TableCell>
                      <TableCell>Situação no sistema de origem</TableCell>
                      <TableCell>Sistema de origem</TableCell>
                      <TableCell>Aceite</TableCell>
                      <TableCell>Detalhes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agreement.convenientExecution.executionProcesses.map(
                      el => (
                        <TableRow>
                          <TableCell>{el.executionId}</TableCell>
                          <TableCell>{el.type}</TableCell>
                          <TableCell>{formatDate(el.date)}</TableCell>
                          <TableCell>{el.processId}</TableCell>
                          <TableCell>{el?.status}</TableCell>
                          <TableCell>{el.systemStatus}</TableCell>
                          <TableCell>{el.system}</TableCell>
                          <TableCell>{el.accepted}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              onClick={() => setExecutionProcess(el)}
                            >
                              <FiInfo size={18} color="#424242" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </Paper>

          <Paper className={classes.collapseContainer}>
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
              collapsedHeight={60}
              style={{
                marginTop: 10,
              }}
            >
              <Label
                title="Órgão concedente"
                value={agreement.accountability.data.organ}
              />
              <Label
                title="Convenente/Contratado"
                value={agreement.accountability.data.convenient}
              />
              <Label
                title="CNPJ"
                value={agreement.accountability.data.documentNumber}
              />
              <Label
                title="Modalidade"
                value={agreement.accountability.data.modality}
              />
              <Label
                title="Situação"
                value={agreement?.accountability?.data?.status}
              />
              <Label
                title="Número"
                value={agreement.accountability.data.number}
              />
              <Label
                title="Vigência"
                value={agreement.accountability.data.validity}
              />
              <Label
                title="Data limite"
                value={format(
                  utcToZonedTime(
                    agreement.accountability.data.limitDate,
                    getTimeZone(),
                  ),
                  'dd/MM/yyyy',
                )}
              />
              <Label
                title="Valor total"
                value={Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(agreement.accountability.data.totalValue)}
              />
              <Label
                title="Valor do repasse"
                value={Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(agreement.accountability.data.transferValue)}
              />
              <Label
                title="Valor de contrapartida"
                value={Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(agreement.accountability.data.counterpartValue)}
              />
              <Label
                title="Valor de rendimento"
                value={Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(agreement.accountability.data.yieldValue)}
              />
            </Collapse>
          </Paper>
        </DialogContent>
      </Dialog>

      <ProgramDetailsDialog
        open={!!program}
        program={program}
        onClose={() => setProgram(null)}
      />

      <ExecutionProcessDetailsDialog
        open={!!executionProcess}
        executionProcess={executionProcess}
        onClose={() => setExecutionProcess(null)}
      />
    </>
  ) : null;
};

export default InfoDialog;
