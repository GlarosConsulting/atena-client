import { MuiPickersComponentsToClassName } from '@material-ui/pickers/typings/overrides';

declare module '@material-ui/core/styles/overrides' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ComponentNameToClassKey extends MuiPickersComponentsToClassName {}
}
