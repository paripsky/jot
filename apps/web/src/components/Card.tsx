import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type CardProps = BoxProps;

const Card: React.FC<CardProps> = (props) => {
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
};

export default Card;
