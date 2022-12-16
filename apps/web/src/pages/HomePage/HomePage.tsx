import { Button, Flex, Heading, Kbd, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import Link from '@/components/Link';
import { useJots } from '@/context/jots';

const HomePage: React.FC = () => {
  const { addJot, recentJots } = useJots();
  const navigate = useNavigate();

  const addNewJot = async () => {
    if (!addJot) return;
    const jot = await addJot();
    navigate(`/jot/${jot.id}`);
  };

  return (
    <Flex h="full" w="full" justifyContent="center" alignItems="center">
      <Flex flexDirection="column" gap="2" textAlign="center">
        <Flex alignItems="center" gap="2" justifyContent="center">
          <Heading size="sm">Pick a Jot</Heading>
          <Text>or</Text>
          <Button colorScheme="primary" size="xs" onClick={addNewJot}>
            Create a new Jot
          </Button>
        </Flex>
        <Heading color="neutral.400" size="sm" mt="2">
          Recents
        </Heading>
        <Flex color="neutral.400" flexDirection="column" gap="2">
          {recentJots.map((jot) => (
            <Flex key={jot.id} gap="4">
              <Link to={`/jot/${jot.id}`} maxW="48">
                <Text noOfLines={1} textAlign="initial">
                  {jot.name}
                </Text>
              </Link>
            </Flex>
          ))}
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
          <Flex gap="16" justifyContent="space-between">
            <Text>Toggle Jot</Text>
            <Flex alignItems="center">
              <Kbd>Ctrl</Kbd>
              <Text>+</Text>
              <Kbd>Shift</Kbd>
              <Text>+</Text>
              <Kbd>J</Kbd>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default HomePage;
