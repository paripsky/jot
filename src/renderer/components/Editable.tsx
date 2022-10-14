import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { Box, ButtonGroup, Collapse, Flex, IconButton } from '@chakra-ui/react';
import React from 'react';

export type EditableProps = {
  children?: React.ReactNode;
  onSave?: () => void;
  onReset?: () => void;
  editForm: React.ReactNode;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};

function Editable({
  children,
  onSave,
  editForm,
  onReset,
  editMode,
  setEditMode,
}: EditableProps) {
  //   if (!editMode) {
  //     return (
  //       <Flex>
  //         {children}
  //         <IconButton
  //           ml="4"
  //           size="sm"
  //           aria-label="Edit Widget"
  //           icon={<EditIcon />}
  //           onClick={() => setEditMode(true)}
  //         />
  //       </Flex>
  //     );
  //   }

  return (
    <Box position="relative" border={editMode ? '1px solid' : 'inherit'}>
      <Collapse in={editMode} unmountOnExit>
        <ButtonGroup justifyContent="end" size="sm" w="full" pr="2" pt="2">
          <IconButton
            aria-label="Cancel"
            icon={<CloseIcon />}
            onClick={() => {
              setEditMode(false);
              onReset?.();
            }}
          />
          <IconButton
            aria-label="Save"
            icon={<CheckIcon />}
            onClick={() => {
              onSave?.();
              setEditMode(false);
            }}
          />
        </ButtonGroup>
        <Box w="full" p="4">
          {editForm}
        </Box>
      </Collapse>
      {!editMode ? (
        <Flex>
          {children}
          <IconButton
            ml="4"
            size="sm"
            aria-label="Edit Widget"
            icon={<EditIcon />}
            onClick={() => setEditMode(true)}
          />
        </Flex>
      ) : (
        <Box position="relative">
          {children}
          {/* <Box
            position="absolute"
            top="0"
            w="full"
            h="full"
            backdropFilter="blur(10px)"></Box> */}
        </Box>
      )}
    </Box>
  );
}

export default Editable;
