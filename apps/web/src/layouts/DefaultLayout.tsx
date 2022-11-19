import { HamburgerIcon } from '@chakra-ui/icons';
import { Flex, Icon, IconButton, useColorMode } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import Spotlight from '../components/Spotlight';
import Sidebar from '../components/Sidebar';
import { useLayout } from '../context/layout';

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
				{/* <Flex justifyContent="center" height="full" overflow="auto"> */}
				<Outlet />
				{/* </Flex> */}
			</Flex>
		</Flex>
	);
}

export default DefaultLayout;
