import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useJots } from '@/context/jots';

import IconPicker from './IconPicker';

export type CreateNewJotModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const defaultProps = {
  name: '',
  icon: '📝',
};

export const CreateNewJotModal: React.FC<CreateNewJotModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(defaultProps.name);
  const [icon, setIcon] = useState(defaultProps.icon);
  const initialRef = useRef(null);
  const { addJot } = useJots();

  const reset = () => {
    setName(defaultProps.name);
    setIcon(defaultProps.icon);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const addNewJot = async () => {
    if (!addJot) return;
    const jot = await addJot({ name, icon });
    navigate(`/jot/${jot.id}`);
    handleClose();
  };

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <IconPicker value={icon} onChange={(newIcon) => setIcon(newIcon)} /> Create a new Jot
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              ref={initialRef}
              placeholder="Jot Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Flex gap="2">
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={addNewJot}>
              Create
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
