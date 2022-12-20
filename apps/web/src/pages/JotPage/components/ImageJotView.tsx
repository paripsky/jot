import { Image } from '@chakra-ui/react';

type ImageJotViewProps = {
  data: unknown;
};

export const ImageJotView: React.FC<ImageJotViewProps> = ({ data }) => {
  return <Image src={data as string} />;
};
