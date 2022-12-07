import { HamburgerIcon } from '@chakra-ui/icons';
import { Flex, Icon, IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Spotlight from '../components/Spotlight';
import { useLayout } from '../context/layout';

function DefaultLayout() {
  const { colorMode } = useColorMode();
  const { toggleSidebar, isSidebarFloating } = useLayout();

  return (
    <Flex h="100vh" css={{ colorScheme: colorMode }}>
      <Spotlight />
      <Sidebar />
      <Flex
        overflow="auto"
        flexDir="column"
        w="full"
        p="4"
        bg={useColorModeValue('neutral.100', 'neutral.800')}
      >
        {isSidebarFloating && (
          <IconButton
            w="fit-content"
            p="2"
            icon={<Icon as={HamburgerIcon} />}
            aria-label="Toggle menu"
            onClick={toggleSidebar}
          />
        )}
        <Outlet />
      </Flex>
    </Flex>
  );
}

export default DefaultLayout;
