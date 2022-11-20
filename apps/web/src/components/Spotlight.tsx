import {
  Box,
  Flex,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';

import { useJots } from '@/context/jots';
import useShortcuts, { Keys } from '@/hooks/useShortcuts';
import { searchableRoutes } from '@/routes';

import LinkButton from './LinkButton';
import MenuList from './MenuList';

const Spotlight: React.FC = () => {
  const bg = useColorModeValue('neutral.300', 'neutral.900');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { jots } = useJots();

  useOutsideClick({
    ref,
    handler: onClose,
  });

  useShortcuts(['CommandOrControl+P', 'CommandOrControl+K'], onOpen);
  useShortcuts([Keys.Escape], onClose);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex justifyContent="center">
          <Box ref={ref} w="2xl" p="4" bg={bg}>
            <Input placeholder="Search..." ref={inputRef} />
          </Box>
        </Flex>
        <MenuList onSelect={onClose} bg="neutral.900">
          {jots.map((jot) => (
            <LinkButton key={jot.id} to={`/jot/${jot.id}`} w="full" variant="ghost">
              {jot.name}
            </LinkButton>
          ))}
          {searchableRoutes.map((route) => (
            <LinkButton key={route.name} to={route.path} w="full" variant="ghost">
              {route.name}
            </LinkButton>
          ))}
        </MenuList>
      </ModalContent>
    </Modal>
  );
};

export default Spotlight;
