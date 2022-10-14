import { Box, useColorMode } from '@chakra-ui/react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { JotItem, JotItemTypes } from 'renderer/context/jots';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../../../github-markdown.css';
import CodeJot from './CodeJot';
import ConverterJotViewer from './ConverterJotViewer';
import { ConverterJotData } from './ConverterJotEditor';
import ReactComponentJot from './ReactComponentJot';

export type JotProps = JotItem;

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
      {}
    );
  }

  return { src: url };
};

const Jot: React.FC<JotProps> = ({ id, type, data }) => {
  const { colorMode } = useColorMode();

  switch (type) {
    case JotItemTypes.embed:
      const embedProps = getEmbedProps(data as string);
      return <Box as="iframe" w="full" h="sm" title="embed" {...embedProps} />;
    case JotItemTypes.excalidraw:
      return (
        <Box h="sm" w="full">
          <Excalidraw
            key={id}
            initialData={{
              elements: data as ExcalidrawElement[],
            }}
            viewModeEnabled
            // zenModeEnabled
            theme={colorMode}
            // onPointerUpdate={(payload) => console.log(payload)}
            // onCollabButtonClick={() =>
            //   window.alert('You clicked on collab button')
            // }
            // viewModeEnabled={viewModeEnabled}
            // zenModeEnabled={zenModeEnabled}
            // gridModeEnabled={gridModeEnabled}
          />
        </Box>
      );
    case JotItemTypes.markdown:
    case JotItemTypes.javascript:
    case JotItemTypes.typescript:
    case JotItemTypes.json:
    case JotItemTypes.html:
      return (
        <ReactMarkdown
          className="markdown-body"
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeJot,
            a({ ...props }) {
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              return <a target="_blank" {...props} />;
            },
          }}
        >
          {type === JotItemTypes.markdown
            ? (data as string)
            : `~~~${type}\n${data as string}\n~~~`}
        </ReactMarkdown>
      );
    case JotItemTypes.converter:
      return <ConverterJotViewer data={data as ConverterJotData} />;
    case JotItemTypes.react:
      return <ReactComponentJot data={data as string} />;
    default:
      return <Box whiteSpace="pre-wrap">{data as string}</Box>;
  }
};

export default Jot;
