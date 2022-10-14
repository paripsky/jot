import { useState } from 'react';
import generateID from '../utils/id';

const useKey = () => {
  const [key, setKey] = useState(() => generateID());

  const resetKey = () => setKey(generateID());

  return { key, resetKey };
};

export default useKey;
