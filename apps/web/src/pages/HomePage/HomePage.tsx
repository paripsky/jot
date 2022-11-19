import { Button, Flex, Heading, Text, Kbd } from '@chakra-ui/react';
import React from 'react';

const HomePage: React.FC = () => {
	return (
		<Flex h="full" w="full" justifyContent="center" alignItems="center">
			<Flex flexDirection="column" gap="2" textAlign="center">
				<Flex alignItems="center" gap="2">
					<Heading size="sm">Pick a Jot</Heading>
					<Text>or</Text>
					<Button colorScheme="primary" size="xs">
						Create a new Jot
					</Button>
				</Flex>
				<Heading color="neutral.400" size="sm" mt="2">
					Recents
				</Heading>
				<Flex color="neutral.400" flexDirection="column" gap="2">
					<Flex gap="4">
						<Text>Jot X</Text>
					</Flex>
					<Flex gap="4">
						<Text>Jot Y</Text>
					</Flex>
				</Flex>
				<Heading color="neutral.400" size="sm" mt="2">
					Shortcuts
				</Heading>
				<Flex color="neutral.400" flexDirection="column" gap="2">
					<Flex gap="4" justifyContent="space-between">
						<Text>Show all commands</Text>
						<Flex alignItems="center">
							<Kbd>Ctrl</Kbd>
							<Text>+</Text>
							<Kbd>P</Kbd>
						</Flex>
					</Flex>
					<Flex gap="4" justifyContent="space-between">
						<Text>Other command</Text>
						<Flex alignItems="center">
							<Kbd>Ctrl</Kbd>
							<Text>+</Text>
							<Kbd>K</Kbd>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default HomePage;
