import { chakra, HTMLChakraProps, useColorModeValue } from '@jot/ui';
import { Link as RouterLink } from 'react-router-dom';

export type LinkProps = HTMLChakraProps<'a'> & {
  to?: string;
  variant?: 'unstyled' | 'link';
};

function Link({ variant = 'link', ...props }: LinkProps) {
  const textColor = useColorModeValue('primary.500', 'primary.200');
  const hoverColor = useColorModeValue('primary.600', 'primary.300');

  const styledLinkProps =
    variant === 'link'
      ? {
          color: textColor,
          _hover: { color: hoverColor },
          display: { base: 'block', sm: 'inline' },
        }
      : {};

  return <chakra.a as={RouterLink} {...styledLinkProps} {...props} />;
}

export default Link;
