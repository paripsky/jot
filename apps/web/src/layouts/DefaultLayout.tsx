import { HamburgerIcon } from '@chakra-ui/icons';
import { Flex, Icon, IconButton, useColorMode } from '@jot/ui';
import { Outlet } from 'react-router-dom';

import { useLayout } from '@/store/layout';

import Sidebar from '../components/Sidebar';
import Spotlight from '../components/Spotlight';

function DefaultLayout() {
  const { colorMode } = useColorMode();
  const { toggleSidebar, isSidebarFloating } = useLayout();

  return (
    <Flex h="100vh" css={{ colorScheme: colorMode }}>
      <Spotlight />
      <Sidebar />
      <Flex overflow="auto" flexDir="column" w="full" p="4">
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
