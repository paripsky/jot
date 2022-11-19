import type { API } from '@jot/electron/src/preload';

declare global {
	interface Window {
		api: API;
	}
}

export {};
