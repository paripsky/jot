import { ColorHues, extendTheme, StyleFunctionProps } from '@chakra-ui/react';
import { theme as defaultTheme } from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';

import { getSearchParam } from './utils/getSearchParam';

const colorMode = getSearchParam('colorMode');

const colors: Record<string, ColorHues> = {
  primary: defaultTheme.colors.blue,
  neutral: defaultTheme.colors.gray,
  accent: defaultTheme.colors.teal,
  success: defaultTheme.colors.green,
  warning: defaultTheme.colors.orange,
  error: defaultTheme.colors.red,
};

const theme = extendTheme({
  config: {
    initialColorMode: colorMode || 'dark',
    useSystemColorMode: false,
  },
  colors,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('white', 'neutral.900')(props),
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

export default theme;
