export enum JotItemTypes {
  markdown = 'markdown',
  javascript = 'javascript',
  typescript = 'typescript',
  json = 'json',
  html = 'html',
  embed = 'embed',
  excalidraw = 'excalidraw',
  converter = 'converter',
  react = 'react',
  kanban = 'kanban',
  todolist = 'todolist',
}

export type JotItem = {
  id: string;
  updatedAt: string;
  createdAt: string;
  type: JotItemTypes;
  data: string | unknown;
};

export type JotEntry = {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
};

export type Jot = {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  items: JotItem[];
  icon?: string;

  // the version of this jot - needed for jot migration in the future
  version?: string;
};

export type CustomJotItem = {
  icon: () => unknown;
  view: (props: { el: HTMLDivElement; data: unknown }) => void;
};
