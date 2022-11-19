import { chakra, HTMLChakraProps, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export type LinkProps = HTMLChakraProps<'a'> & {
	to?: string;
	variant?: 'unstyled' | 'link';
};

const Link: React.FC<LinkProps> = ({ variant = 'link', ...props }) => {
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
};

export default Link;
