import React from 'react';
import { styled } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  compose,
  borders,
  palette,
  positions,
  shadows,
  sizing,
  spacing,
  typography,
  BordersProps,
  PaletteProps,
  PositionsProps,
  ShadowsProps,
  SizingProps,
  SpacingProps,
  TypographyProps,
} from '@material-ui/system';

type TextProps = {
  className?: string;
  variant?:
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'inherit'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'overline'
    | 'srOnly';
  style?: React.CSSProperties;
} & BordersProps &
  PaletteProps &
  PositionsProps &
  ShadowsProps &
  SizingProps &
  SpacingProps &
  TypographyProps;

const Composed = styled(Typography)(
  compose(borders, palette, positions, shadows, sizing, spacing, typography),
);

const Text: React.FC<TextProps> = ({ children, ...rest }) => (
  <Composed variant="caption" {...rest}>
    {children}
  </Composed>
);

export default Text;
