import { Flex, useColorMode } from '@chakra-ui/react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { editor } from 'monaco-editor';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { JotItemData, JotItemTypes } from '@/context/jots';

import Editor from '../../../components/CodeEditor';
import ConverterJotEditor, { ConverterJotData } from './ConverterJotEditor';

export type JotEditorProps = {
  data: JotItemData;
  type: JotItemTypes;
  onChange: (data: JotItemData) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

function JotEditor({ data, type, onChange, onSubmit, onCancel }: JotEditorProps) {
  const { colorMode } = useColorMode();
  const [monacoTheme, setMonacoTheme] = useState('dark');
  // const [code, setCode] = useState(codeProp);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const onEnterRef = useRef<() => void>(onSubmit);
  onEnterRef.current = onSubmit;
  const onCancelRef = useRef<() => void>(onSubmit);
  const excalidrawRef = useRef<ExcalidrawImperativeAPI | null>(null);
  onCancelRef.current = onCancel;
  const initialExcalidrawData = useMemo(
    () => ({
      elements: data as ExcalidrawElement[],
    }),
    [data],
  );

  const handleEditorDidMount = (e: editor.IStandaloneCodeEditor) => {
    editorRef.current = e;
    // e.addCommand(KeyCode.Enter, () => {
    //   onEnterRef.current();
    // });
    // e.addCommand(KeyCode.Escape, () => {
    //   onCancelRef.current();
    // });
  };

  const codeChanged = (newCode = data) => {
    onChange(newCode);
  };

  useEffect(() => {
    setMonacoTheme(colorMode === 'light' ? 'vs-light' : 'dark');
  }, [colorMode]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onExcalidrawChange = useCallback(
    (elements: readonly ExcalidrawElement[]) => {
      if (elements === data) return;
      onChange(elements as ExcalidrawElement[]);
    },
    [onChange, data],
  );

  // useEffect(() => {
  //   if (type !== JotItemTypes.excalidraw || !excalidrawRef.current) return;
  //   if (excalidrawRef.current.getSceneElementsIncludingDeleted() === data)
  //     return;
  //   console.log('done', data);
  //   excalidrawRef.current.updateScene({
  //     elements: data as ExcalidrawElement[],
  //   });
  // }, [type, data]);

  const editorInput = (() => {
    switch (type) {
      case JotItemTypes.excalidraw:
        return (
          <Flex minH="sm" h="full" w="full">
            <Excalidraw
              ref={excalidrawRef}
              // key={editing ? editing.id : undefined}
              initialData={initialExcalidrawData}
              onChange={onExcalidrawChange}
              theme={colorMode}
              // onPointerUpdate={(payload) => console.log(payload)}
              // onCollabButtonClick={() =>
              //   window.alert('You clicked on collab button')
              // }
              // viewModeEnabled={viewModeEnabled}
              // zenModeEnabled={zenModeEnabled}
              // gridModeEnabled={gridModeEnabled}
            />
          </Flex>
        );
      case JotItemTypes.converter:
        return <ConverterJotEditor data={data as ConverterJotData} onChange={onChange} />;
      default:
        return (
          <Editor
            height="150px"
            options={{
              lineNumbers: 'off',
              minimap: { enabled: false },
            }}
            language={type}
            theme={monacoTheme}
            // defaultValue={code}
            onChange={codeChanged}
            value={data as string}
            onMount={handleEditorDidMount}
          />
        );
    }
  })();

  return editorInput;
}

export default JotEditor;
