import { Spinner } from '@chakra-ui/react';
import React, { Suspense } from 'react';

const JotPage = React.lazy(() => import('./pages/JotPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));

export const withSuspense = (Component: React.FC) => (
	<Suspense fallback={<Spinner />}>
		<Component />
	</Suspense>
);

const routes = [
	{
		name: 'Jot',
		path: 'jot/:jotId',
		element: withSuspense(JotPage),
		showInSearch: false,
	},
	{
		name: 'Settings',
		path: 'settings',
		element: withSuspense(SettingsPage),
	},
	{
		name: 'Home',
		path: '/',
		index: true,
		element: withSuspense(HomePage),
	},
];

export const searchableRoutes = routes.filter((route) => route.showInSearch !== false);

export default routes;
