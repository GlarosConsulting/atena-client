import { makeStyles } from '@material-ui/core/styles';

interface CustomScrollbarOptions {
  background: string;
  track: string;
  thumb: string;
}

const useStyles = makeStyles({
  root: {
    overflowY: 'auto',
    height: '100%',
    '&::-webkit-scrollbar': {
      width: 30,
    },
    '&::-webkit-scrollbar-track, &::-webkit-scrollbar-thumb': {
      marginTop: 17.5,
      marginBottom: 15,
      borderRadius: 50,
      border: (options: CustomScrollbarOptions): string =>
        `10px solid ${options.background}`,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: (options: CustomScrollbarOptions): string =>
        options.track,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: (options: CustomScrollbarOptions): string =>
        options.thumb,
    },
  },
});

const useCustomScrollbar = (options: CustomScrollbarOptions): string => {
  const classes = useStyles(options);

  return classes.root;
};

export default useCustomScrollbar;
