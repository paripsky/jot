import { logger } from './logger';

enum JotPluginTypes {
  jotItem = 'jotItem',
}

type JotPluginProps = {
  data: unknown;
  el: HTMLElement;
  onChange: (data: unknown) => void;
  isReadOnly: boolean;
};

type JotPlugin = {
  type: JotPluginTypes;
  name: string;
  render: (props: JotPluginProps) => void;
};

export const plugin: JotPlugin = {
  type: JotPluginTypes.jotItem,
  name: 'My Plugin',
  render: ({ data, onChange }: JotPluginProps) => {
    logger.log(data, onChange);
  },
};

export default plugin;
