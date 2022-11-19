export type ReactComponentWidget = {
	type: 'react-component';
	code: string;
};

export type TextWidget = {
	type: 'text';
	text: string;
};

export type ImageWidget = {
	type: 'image';
	src: string;
	alt: string;
};

export type VideoWidget = {
	type: 'video';
	src: string;
};

export type CodeWidget = {
	type: 'code';
	code: string;
	highlight: boolean;
};

export type LinkWidget = {
	type: 'link';
	href: string;
	text: string;
};

export type EmbedWidget = {
	type: 'embed';
	src: string;
};

export type DocWidget = (
	| ReactComponentWidget
	| TextWidget
	| ImageWidget
	| VideoWidget
	| CodeWidget
	| LinkWidget
	| EmbedWidget
) & {
	title?: string;
};
