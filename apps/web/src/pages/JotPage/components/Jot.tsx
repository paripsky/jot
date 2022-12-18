import '../../../github-markdown.css';

import { Box, Image, useColorMode } from '@chakra-ui/react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { customJotItems, JotItem, JotItemData, JotItemTypes } from '@/context/jots';

import CodeJot from './CodeJot';
import { ConverterJotData } from './ConverterJotEditor';
import ConverterJotViewer from './ConverterJotViewer';
import KanbanJot from './KanbanJot';
import ReactComponentJot from './ReactComponentJot';
import TodoListJot from './TodoListJot';

export type JotProps = JotItem & {
  onChange: (newData: JotItemData) => void;
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

const Jot: React.FC<JotProps> = ({ id, type, data, onChange }) => {
  const { colorMode } = useColorMode();
  const customJotItem = customJotItems[type];
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!customJotItem || !containerRef.current) return;
    containerRef.current.replaceChildren();
    customJotItem.view({ el: containerRef.current, data });
  }, [customJotItem, data]);

  switch (type) {
    case JotItemTypes.embed: {
      const embedProps = getEmbedProps(data as string);
      return <Box as="iframe" w="full" h="sm" title="embed" {...embedProps} />;
    }
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
              return (
                <a target="_blank" {...props}>
                  {props.children}
                </a>
              );
            },
          }}
        >
          {type === JotItemTypes.markdown ? (data as string) : `~~~${type}\n${data as string}\n~~~`}
        </ReactMarkdown>
      );
    case JotItemTypes.converter:
      return <ConverterJotViewer data={data as ConverterJotData} />;
    case JotItemTypes.react:
      return <ReactComponentJot data={data as string} />;
    case JotItemTypes.kanban:
      return <KanbanJot data={data as string} onChange={onChange} />;
    case JotItemTypes.todolist:
      return <TodoListJot data={data as string} onChange={onChange} />;
    case JotItemTypes.image:
      return <Image src={data as string} />;
    default:
      if (customJotItem) {
        return <Box ref={containerRef} />;
      }

      return <Box whiteSpace="pre-wrap">{data as string}</Box>;
  }
};

export default Jot;
