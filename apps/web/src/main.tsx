import React, { Suspense } from 'react';
import { ChakraProvider, ColorModeScript, Spinner } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { LayoutProvider } from './context/layout';
import { SettingsProvider } from './context/settings';
import { JotsProvider } from './context/jots';
import theme from './theme';

const container = document.getElementById('root');

if (container) {
	const root = createRoot(container);

	const App = React.lazy(() => import('./App'));
	const SandboxPage = React.lazy(() => import('./pages/SandboxPage'));

	const isSandbox = window.location.pathname.startsWith('/sandbox');

	root.render(
		<React.StrictMode>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<ChakraProvider theme={theme}>
				<BrowserRouter>
					{isSandbox ? (
						<Suspense fallback={<Spinner />}>
							<SandboxPage />
						</Suspense>
					) : (
						<SettingsProvider>
							<JotsProvider>
								<LayoutProvider>
									<Suspense fallback={<Spinner />}>
										<App />
									</Suspense>
								</LayoutProvider>
							</JotsProvider>
						</SettingsProvider>
					)}
				</BrowserRouter>
			</ChakraProvider>
		</React.StrictMode>,
	);
} else {
	throw new Error('root element missing');
}
