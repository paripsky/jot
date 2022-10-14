import { extendTheme, ColorHues, StyleFunctionProps } from '@chakra-ui/react';
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

// const availableColorTints = [
//   50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
// ] as const;

// const tokenToColorMap = {
//   primary: 'primary',
//   neutral: 'neutral',
//   accent: 'accent',
//   success: 'success',
//   warning: 'warning',
//   error: 'error',
// };

// const tokenColors = Object.entries(tokenToColorMap).reduce(
//   (acc, [token, color]) => {
//     availableColorTints.forEach((tint, index) => {
//       acc[`${token}.${tint}`] = {
//         default:
//           colors[color][
//             availableColorTints[availableColorTints.length - 1 - index]
//           ],
//         _dark: colors[color][tint],
//       };
//     });
//     return acc;
//   },
//   {} as Record<string, { default: string; _dark: string }>
// );

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
      // ...tokenColors,
      text: {
        default: 'neutral.900',
        _dark: 'neutral.50',
      },
    },
  },
});

export default theme;
