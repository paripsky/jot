import {
  Box,
  Divider,
  Flex,
  FlexProps,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

type DividerWithTextProps = FlexProps;

const DividerWithText: React.FC<DividerWithTextProps> = (props) => {
  const { children, ...flexProps } = props;

  return (
    <Flex align="center" color="neutral.300" {...flexProps}>
      <Box flex="1">
        <Divider borderColor="currentcolor" />
      </Box>
      <Text
        as="span"
        px="3"
        color={useColorModeValue('neutral.600', 'neutral.400')}
        fontWeight="medium"
      >
        {children}
      </Text>
      <Box flex="1">
        <Divider borderColor="currentcolor" />
      </Box>
    </Flex>
  );
};

export default DividerWithText;
