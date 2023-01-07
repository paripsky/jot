import {
  Box,
  Flex,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@jot/ui';
import React, { useEffect, useRef } from 'react';

import { useJots } from '@/context/jots';
import useShortcuts, { Keys } from '@/hooks/useShortcuts';
import { searchableRoutes } from '@/routes';

import LinkButton from './LinkButton';
import MenuList from './MenuList';

function Spotlight() {
  const bg = useColorModeValue('neutral.300', 'neutral.900');
  const { isOpen, onClose, onOpen } = useDisclosure();
  const ref = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { jots } = useJots();

  useShortcuts(['CommandOrControl+P', 'CommandOrControl+K'], onOpen);
  useShortcuts([Keys.Escape], onClose);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!inputRef.current) return;
    if (!['ArrowDown', 'ArrowUp', 'Escape', 'Tab', 'Enter', ' '].includes(e.key)) {
      inputRef.current.focus();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={inputRef}>
      <ModalOverlay />
      <ModalContent onKeyDown={onKeyDown}>
        <Flex justifyContent="center">
          <Box ref={ref} w="2xl" p="4" bg={bg}>
            <Input placeholder="Search..." ref={inputRef} />
          </Box>
        </Flex>
        <MenuList onSelect={onClose} bg="neutral.900">
          {({ focusedIndex }) => (
            <>
              {[
                ...jots.map(({ id, name }) => ({ to: `/jot/${id}`, name })),
                ...searchableRoutes.map((route) => ({ to: route.path, name: route.name })),
              ].map((item, index) => (
                <LinkButton
                  key={item.to}
                  to={item.to}
                  w="full"
                  borderRadius="0"
                  variant={focusedIndex === index ? 'solid' : 'ghost'}
                >
                  <Text whiteSpace="pre-wrap">{item.name}</Text>
                </LinkButton>
              ))}
            </>
          )}
        </MenuList>
      </ModalContent>
    </Modal>
  );
}

export default Spotlight;
