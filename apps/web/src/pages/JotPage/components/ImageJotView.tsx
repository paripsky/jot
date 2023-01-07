import { Image } from '@jot/ui';

type ImageJotViewProps = {
  data: unknown;
};

export const ImageJotView: React.FC<ImageJotViewProps> = ({ data }) => {
  return <Image src={data as string} />;
};
