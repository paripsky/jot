import { Flex, Heading, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';
import { functionEval } from 'renderer/utils/evaluate';
import { ConverterJotData } from './ConverterJotEditor';

export type ConverterJotViewerProps = {
  data: ConverterJotData;
};

const ConverterJotViewer: React.FC<ConverterJotViewerProps> = ({ data }) => {
  // TODO: add error handling here and in the from + to calls (add error message below)
  const [conversionFunctions] = useState(() => ({
    from: functionEval(data.from),
    to: functionEval(data.to),
  }));
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const onFromValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFromValue(e.target.value);
    setToValue(conversionFunctions.from(e.target.value));
  };

  const onToValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setToValue(e.target.value);
    setFromValue(conversionFunctions.to(e.target.value));
  };

  return (
    <Flex flexDirection="column" gap="2">
      <Flex>
        <Heading size="md">{data.title}</Heading>
      </Flex>
      <Flex gap="2">
        <Textarea value={fromValue} onChange={onFromValueChange} />
        <Textarea value={toValue} onChange={onToValueChange} />
      </Flex>
    </Flex>
  );
};

export default ConverterJotViewer;
