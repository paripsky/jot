import { theme as defaultTheme } from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';
import { ColorHues, extendTheme, StyleFunctionProps } from '@jot/ui';

import { getSearchParam } from './utils/getSearchParam';

const colorMode = getSearchParam('colorMode');

export const defaultColors: Record<string, ColorHues> = {
  primary: defaultTheme.colors.blue,
  neutral: defaultTheme.colors.gray,
  accent: defaultTheme.colors.teal,
  success: defaultTheme.colors.green,
  warning: defaultTheme.colors.orange,
  error: defaultTheme.colors.red,
};

export type CreateThemeOptions = {
  colors: Record<string, ColorHues>;
};

export const createTheme = ({ colors }: CreateThemeOptions) =>
  extendTheme({
    config: {
      initialColorMode: colorMode || 'dark',
      useSystemColorMode: false,
    },
    colors,
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          bg: mode('white', 'neutral.800')(props),
        },
      }),
    },
    semanticTokens: {
      colors: {
        text: {
          default: 'neutral.900',
          _dark: 'neutral.50',
        },
      },
    },
  });
