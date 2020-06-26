import { makeStyles } from '@material-ui/core/styles';

interface ContentShadowOptions {
  color: string;
}

const useStyles = makeStyles({
  root: {
    position: 'relative',
    paddingTop: 27.5,
    paddingBottom: 27.5,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      width: '100%',
      height: 35,
      boxShadow: (options: ContentShadowOptions): string => `inset 0px 40px 10px -15px ${options.color}`,
      zIndex: 1,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -2,
      width: '100%',
      height: 35,
      boxShadow: (options: ContentShadowOptions): string => `inset 0px -40px 10px -15px ${options.color}`,
      zIndex: 1,
    },
  },
});

const useContentShadow = (options: ContentShadowOptions): string => {
  const classes = useStyles(options);

  return classes.root;
};

export default useContentShadow;
