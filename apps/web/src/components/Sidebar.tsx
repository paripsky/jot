import {
  Avatar,
  Box,
  Button,
  chakra,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { useMemo, useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { MdAddCircleOutline, MdNotes, MdStorefront } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import { useJots } from '../context/jots';
import { useLayout } from '../context/layout';
import { useSettings } from '../context/settings';
import { getAvatarUrl } from '../utils/avatar';
import LinkButton from './LinkButton';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const { jots, jotsLoading, addJot } = useJots();
  const loadingUser = false;
  const { isSidebarOpen, toggleSidebar, isSidebarFloating } = useLayout();
  const { settings } = useSettings();
  const navigate = useNavigate();

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
      <InputGroup my="2">
        {/* <InputRightElement>
          <Kbd>/</Kbd>
        </InputRightElement> */}
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
        {/* Content */}
        {/* <Link to="/util/base64">base64</Link> */}
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
              to={`/jot/${id}`}
            >
              <Text noOfLines={1} whiteSpace="initial" textAlign="initial" fontSize="sm">
                {name}
              </Text>
            </LinkButton>
          ))
        )}
      </Box>
      <Button
        leftIcon={<Icon boxSize={5} as={MdAddCircleOutline} />}
        w="full"
        justifyContent="flex-start"
        variant="ghost"
        fontSize="sm"
        onClick={addNewJot}
      >
        Create
      </Button>
      <LinkButton
        leftIcon={<Icon boxSize={5} as={MdStorefront} />}
        w="full"
        justifyContent="flex-start"
        variant="ghost"
        fontSize="sm"
        to="/marketplace"
      >
        Marketplace
      </LinkButton>
      <LinkButton
        leftIcon={<Icon boxSize={5} as={MdNotes} />}
        w="full"
        justifyContent="flex-start"
        variant="ghost"
        fontSize="sm"
        to="/marketplace"
      >
        Docs
      </LinkButton>
      <LinkButton
        leftIcon={<Icon boxSize={5} as={FiSettings} />}
        w="full"
        justifyContent="flex-start"
        variant="ghost"
        fontSize="sm"
        to="/settings"
      >
        Settings
      </LinkButton>
      <Box borderTopWidth={1} mb="2" mt="4" />
      <Skeleton isLoaded={!loadingUser}>
        <Menu placement="top">
          <MenuButton aria-label="Options" as="div">
            <Box display="flex" alignItems="center" p="2" pointerEvents="all" cursor="pointer">
              <Avatar
                name="John Doe"
                size="sm"
                src={getAvatarUrl(settings.nickname, settings.avatarType)}
                mr="2"
              />
              <Box overflow="hidden">
                {/* <Link to="/login"> */}
                <Text fontWeight="semibold" noOfLines={1} title={settings.nickname}>
                  {settings.nickname}
                </Text>
                {/* </Link> */}
              </Box>
            </Box>
          </MenuButton>
          <MenuList>
            <MenuItem>Log out</MenuItem>
          </MenuList>
        </Menu>
      </Skeleton>
    </>
  );

  if (isSidebarFloating) {
    return (
      <Drawer isOpen={isSidebarOpen} placement="left" onClose={toggleSidebar} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          {/* <DrawerHeader>Create your account</DrawerHeader> */}

          <DrawerBody display="flex" flexDir="column" p="2">
            <Box h="8" />
            {sidebarBody}
          </DrawerBody>

          {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <chakra.aside
      aria-hidden={!isSidebarOpen}
      role={isSidebarOpen ? 'dialog' : 'none'}
      tabIndex={isSidebarOpen ? 0 : -1}
      // bg={useColorModeValue('neutral.50', 'neutral.900')}
      display="flex"
      flexDir="column"
      w="3xs"
      p="2"
      borderRightWidth={1}
      {...floatingProps}
    >
      {sidebarBody}
    </chakra.aside>
  );
};

export default Sidebar;
