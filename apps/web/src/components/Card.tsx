import { Box, BoxProps, useColorModeValue } from '@jot/ui';

type CardProps = BoxProps;

export function Card(props: CardProps) {
  return (
    <Box
      bg={useColorModeValue('neutral.100', 'neutral.700')}
      py="8"
      px={{ base: '4', md: '10' }}
      shadow="base"
      rounded={{ sm: 'lg' }}
      {...props}
    />
  );
}

export default Card;
