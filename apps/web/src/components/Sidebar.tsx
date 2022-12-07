import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Kbd,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useMemo, useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FiFolder, FiSettings } from 'react-icons/fi';
import { MdAddCircleOutline, MdNotes, MdStorefront } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import { useJots } from '../context/jots';
import { useLayout } from '../context/layout';
import { useSettings } from '../context/settings';
import { getAvatarUrl } from '../utils/avatar';
import Link from './Link';
import LinkButton from './LinkButton';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const { jots, jotsLoading, addJot } = useJots();
  const { isSidebarOpen, toggleSidebar, isSidebarFloating } = useLayout();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const { isOpen: isJotMenuOpen, onToggle: toggleJotMenu } = useDisclosure({ defaultIsOpen: true });
  const jotMenuBg = useColorModeValue('neutral.200', 'neutral.800');

  const matchingJots = useMemo(() => {
    if (!searchText) return jots;

    return jots.filter((jot) => jot.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, jots]);

  const addNewJot = async () => {
    if (!addJot) return;
    const jot = await addJot();
    navigate(`/jot/${jot.id}`);
  };

  const floatingProps = useMemo(() => {
    if (!isSidebarFloating) return {};

    return {
      position: 'fixed',
      zIndex: 2,
      height: 'full',
      transition: 'transform 0.2s ease-in-out',
      transform: `translateX(${isSidebarOpen ? 0 : '-100%'})`,
    } as const;
  }, [isSidebarFloating, isSidebarOpen]);

  const sidebarBody = (
    <>
      <Flex flex="1" h="full">
        <Flex
          flexDirection="column"
          borderRightWidth={1}
          bg={useColorModeValue('neutral.200', 'neutral.900')}
        >
          <IconButton
            icon={<Icon boxSize="6" as={FiFolder} />}
            borderRadius="none"
            size="lg"
            variant="ghost"
            aria-label="Toggle Jot List"
            onClick={toggleJotMenu}
          />
          <IconButton
            icon={<Icon boxSize="6" as={MdAddCircleOutline} />}
            borderRadius="none"
            size="lg"
            variant="ghost"
            aria-label="Create Jot"
            onClick={addNewJot}
          />
          <Link to="/marketplace">
            <IconButton
              icon={<Icon boxSize="6" as={MdStorefront} />}
              borderRadius="none"
              size="lg"
              variant="ghost"
              aria-label="Marketplace"
            />
          </Link>
          <Link to="/docs">
            <IconButton
              icon={<Icon boxSize="6" as={MdNotes} />}
              borderRadius="none"
              size="lg"
              variant="ghost"
              aria-label="Docs"
            />
          </Link>
          <Link to="/settings" mt="auto">
            <IconButton
              icon={
                <Avatar
                  name="John Doe"
                  size="xs"
                  src={getAvatarUrl(settings.nickname, settings.avatarType)}
                />
              }
              borderRadius="none"
              size="lg"
              variant="ghost"
              aria-label="Profile"
            />
          </Link>
          <Link to="/settings">
            <IconButton
              icon={<Icon boxSize="6" as={FiSettings} />}
              borderRadius="none"
              size="lg"
              variant="ghost"
              aria-label="Settings"
            />
          </Link>
        </Flex>
        {isJotMenuOpen && (
          <Flex flexDirection="column" p="2" w="3xs" bg={jotMenuBg}>
            <InputGroup size="sm">
              <InputRightElement>
                <Kbd>/</Kbd>
              </InputRightElement>
              <InputLeftElement>
                <Icon as={BsSearch} />
              </InputLeftElement>
              <Input
                placeholder="Search"
                ref={searchRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </InputGroup>
            <Box flex="1" maxH="full" overflow="auto" p="1">
              {jotsLoading ? (
                <Spinner />
              ) : (
                matchingJots.map(({ id, name, icon }) => (
                  <LinkButton
                    key={id}
                    size="xs"
                    leftIcon={icon ? <>{icon}</> : undefined}
                    w="full"
                    justifyContent="flex-start"
                    variant={location.pathname.includes(`/jot/${id}`) ? 'solid' : 'outline'}
                    // mb="2"
                    border="none"
                    borderRadius="none"
                    to={`/jot/${id}`}
                  >
                    <Text noOfLines={1} whiteSpace="initial" textAlign="initial" fontSize="sm">
                      {name}
                    </Text>
                  </LinkButton>
                ))
              )}
            </Box>
          </Flex>
        )}
      </Flex>
    </>
  );

  if (isSidebarFloating) {
    return (
      <Drawer isOpen={isSidebarOpen} placement="left" onClose={toggleSidebar} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody display="flex" flexDir="column" p="2">
            {sidebarBody}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Flex
      as="aside"
      aria-hidden={!isSidebarOpen}
      role={isSidebarOpen ? 'dialog' : 'none'}
      tabIndex={isSidebarOpen ? 0 : -1}
      flexDir="column"
      borderRightWidth={1}
      {...floatingProps}
    >
      {sidebarBody}
    </Flex>
  );
};

export default Sidebar;
