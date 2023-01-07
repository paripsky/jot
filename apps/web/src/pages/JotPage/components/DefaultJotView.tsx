import { Box } from '@jot/ui';

type DefaultJotViewProps = {
  data: unknown;
};

export const DefaultJotView: React.FC<DefaultJotViewProps> = ({ data }) => {
  return <Box whiteSpace="pre-wrap">{data as string}</Box>;
};
