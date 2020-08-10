/* eslint-disable */
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#E0E0E0',
    },
    secondary: {
      main: '#424242',
    },
    text: {
      primary: '#303030',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    allVariants: {
      color: '#303030',
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: '#DDD',
      },
    },
    MuiFormLabel: {
      root: {
        '&[class*="focused"]':{
        color: '#707070'}
      }
    },
    MuiInputLabel: {
      outlined: {
        transform: 'translate(14px, 17px) scale(1)',
        color: '#606060'
      }
    },
    MuiOutlinedInput: {
      root:{
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#999'
        },
        '&[class*="focused"] [class*="notchedOutline"]': {
          borderColor: '#757575'
        },
      },
      input: {
        padding: '14px 14px',
        color: '#505050'
      },
      notchedOutline: {
        transition: 'all 250ms ease',
        borderRadius: 8,
        borderColor: '#999',
        '& > legend[class*="legendLabelled"] > span': {
          color: '#000'
        }
      },
    },
    MuiSelect: {
      select: {
        color: '#505050',
        '&:focus': {
          backgroundColor: 'none'
        }
      },
    },
    MuiPickersArrowSwitcher: {
      iconButton: {
        backgroundColor: '#DDD'
      }
    },
    MuiPickersDesktopDateRangeCalendar: {
      rangeCalendarContainer: {
        marginTop: 10
      },
      calendar: {
        '& .MuiPickersDateRangeDay-rangeIntervalDayHighlightStart button.Mui-selected': {
          backgroundColor: '#707070'
        },
        '& .MuiPickersDateRangeDay-rangeIntervalDayHighlightEnd button.Mui-selected': {
          backgroundColor: '#707070'
        }
      }
    },
    MuiPickersCalendar: {
      root: {
        '& .MuiPickersDateRangeDay-rangeIntervalDayHighlight': {
          backgroundColor: '#AAA',
          '& span[class*="dayLabel"]': {
            color: '#FFF'
          }
        },
      },
    },
    MuiPickersDay: {
      root: {
        '&.Mui-selected': {
          backgroundColor: '#707070',
          color: '#FFF'
        }
      },
      selected: {
        backgroundColor: '#707070'
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: 10,
      },
    },
    MuiDialogContent: {
      dividers: {
        borderTop: '2px solid #AAA',
        borderBottom: '2px solid #AAA',
      },
    },
    MuiDialogActions: {
      spacing: {
        '& > :not(:first-child)': {
          marginLeft: 15,
        },
      },
    },
    MuiLinearProgress: {
      root: {
        height: 10,
        borderRadius: 50,
      },
      bar: {
        borderRadius: 50,
      },
      colorPrimary: {
        backgroundColor: '#CCC',
      },
      barColorPrimary: {
        backgroundColor: '#606060',
      },
    },
    MuiButton: {
      contained: {
        backgroundColor: '#AAA',
        '&:hover': {
          backgroundColor: '#BBB',
        }
      },
    }
  },
});

theme = responsiveFontSizes(theme);

export default theme;
