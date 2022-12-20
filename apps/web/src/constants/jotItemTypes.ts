import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { ImEmbed } from 'react-icons/im';
import { SiHtml5, SiJavascript, SiMarkdown, SiReact, SiTypescript } from 'react-icons/si';
import { VscJson } from 'react-icons/vsc';

import ConverterJotEditor from '@/pages/JotPage/components/ConverterJotEditor';
import ConverterJotViewer from '@/pages/JotPage/components/ConverterJotViewer';
import { EmbedJotView } from '@/pages/JotPage/components/EmbedJotView';
import ExcalidrawJotEdit from '@/pages/JotPage/components/ExcalidrawJotEdit';
import { ExcalidrawJotView } from '@/pages/JotPage/components/ExcalidrawJotView';
import { ImageJotView } from '@/pages/JotPage/components/ImageJotView';
import KanbanJot from '@/pages/JotPage/components/KanbanJot';
import { MarkdownJotView } from '@/pages/JotPage/components/MarkdownJotView';
import ReactComponentJot from '@/pages/JotPage/components/ReactComponentJot';
import TodoListJot from '@/pages/JotPage/components/TodoListJot';

export type JotItemViewProps = {
  id: string;
  type: string;
  data: unknown;
  onChange: (newData: unknown) => void;
};

export type JotItemEditProps = {
  data: unknown;
  type: string;
  onChange: (data: unknown) => void;
};

export type JotItemTypeValue = {
  id: string;
  name: string;
  icon?: React.FC;
  defaultData?: unknown;
  view?: React.FC<JotItemViewProps>;
  edit?: React.FC<JotItemEditProps>;
};

export type CustomJotItemTypeValue = {
  id: string;
  name: string;
  icon?: React.FC;
  defaultData?: unknown;
  view?: (props: { el: HTMLDivElement; data: unknown }) => void;
  edit?: (props: { el: HTMLDivElement; data: unknown }) => void;
};

export const jotItemTypes: Record<string, JotItemTypeValue> = {
  markdown: { id: 'markdown', icon: SiMarkdown, name: 'Markdown', view: MarkdownJotView },
  javascript: { id: 'javascript', icon: SiJavascript, name: 'Javascript', view: MarkdownJotView },
  typescript: { id: 'typescript', icon: SiTypescript, name: 'Typescript', view: MarkdownJotView },
  json: { id: 'json', icon: VscJson, name: 'JSON', view: MarkdownJotView },
  html: { id: 'html', icon: SiHtml5, name: 'HTML', view: MarkdownJotView },
  embed: { id: 'embed', icon: ImEmbed, name: 'Embed', view: EmbedJotView },
  excalidraw: {
    id: 'excalidraw',
    name: 'Excalidraw',
    defaultData: [],
    view: ExcalidrawJotView,
    edit: ExcalidrawJotEdit,
  },
  converter: {
    id: 'converter',
    icon: FaExchangeAlt,
    name: 'Converter',
    view: ConverterJotViewer,
    edit: ConverterJotEditor,
  },
  react: { id: 'react', icon: SiReact, name: 'React', view: ReactComponentJot },
  kanban: { id: 'kanban', name: 'Kanban', view: KanbanJot },
  todolist: { id: 'todolist', name: 'Todolist', view: TodoListJot },
  image: { id: 'image', name: 'Image', view: ImageJotView },
};
