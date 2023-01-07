import { Box } from '@jot/ui';

type EmbedJotViewProps = {
  data: unknown;
};

const getIframeElFromString = (xml: string) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'text/html');

  return xmlDoc.querySelector('iframe') as HTMLIFrameElement | null;
};

const getEmbedProps = (url: string) => {
  if (url.includes('gist.github.com')) {
    return { src: `${url}.pibb` };
  }

  if (url.includes('<iframe')) {
    const iframe = getIframeElFromString(url);

    if (!iframe) return { src: url };
    return ['src', 'allow'].reduce(
      (obj, name) => ({
        ...obj,
        [name]: iframe.getAttribute(name),
      }),
      {},
    );
  }

  return { src: url };
};

export const EmbedJotView: React.FC<EmbedJotViewProps> = ({ data }) => {
  const embedProps = getEmbedProps(data as string);
  return <Box as="iframe" w="full" h="sm" title="embed" {...embedProps} />;
};
