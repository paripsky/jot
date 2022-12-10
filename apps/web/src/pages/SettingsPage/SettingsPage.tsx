import {
  Box,
  chakra,
  Checkbox,
  Flex,
  GridItem,
  Heading,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import { useSettings } from '@/store/settings';
import { AvatarType, avatarTypes } from '@/utils/avatar';

const SettingsPage: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { avatarType, updateSettings } = useSettings();

  return (
    <Box m="4">
      <Box mt={[10, 0]}>
        <SimpleGrid
          display={{ base: 'initial', md: 'grid' }}
          columns={{ md: 3 }}
          spacing={{ md: 6 }}
        >
          <GridItem colSpan={{ md: 1 }}>
            <Box px={[4, 0]}>
              <Heading fontSize="lg" fontWeight="medium" lineHeight="6">
                General
              </Heading>
              <Text mt={1} fontSize="sm" color={useColorModeValue('neutral.600', 'neutral.400')}>
                Common app options
              </Text>
            </Box>
          </GridItem>
          <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
            <chakra.form
              method="POST"
              shadow="base"
              rounded={[null, 'md']}
              overflow={{ sm: 'hidden' }}
            >
              <Stack
                px={4}
                py={5}
                p={[null, 6]}
                bg={useColorModeValue('neutral.100', 'neutral.700')}
                spacing={6}
              >
                <chakra.fieldset>
                  <Box
                    as="legend"
                    fontSize="md"
                    color={useColorModeValue('neutral.900', 'neutral.50')}
                  >
                    Theme
                    <Text fontSize="sm" color={useColorModeValue('neutral.500', 'neutral.400')}>
                      Color theme
                    </Text>
                  </Box>
                  <RadioGroup
                    fontSize="sm"
                    color={useColorModeValue('neutral.700', 'neutral.50')}
                    mt={4}
                    value={colorMode}
                    onChange={(value) => (value !== colorMode ? toggleColorMode() : null)}
                  >
                    <Stack spacing={4}>
                      <Radio spacing={3} value="dark">
                        Dark
                      </Radio>
                      <Radio spacing={3} value="light">
                        Light
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <Flex gap="2" mt="4" alignItems="center">
                    <Text>Primary: </Text>
                    <Box
                      display="inline-block"
                      background="blue.500"
                      w="4"
                      h="4"
                      borderRadius="lg"
                    />
                    <Box
                      display="inline-block"
                      background="purple.500"
                      w="4"
                      h="4"
                      borderRadius="lg"
                    />
                    <Box
                      display="inline-block"
                      background="green.500"
                      w="4"
                      h="4"
                      borderRadius="lg"
                    />
                    <Box
                      display="inline-block"
                      background="cyan.500"
                      w="4"
                      h="4"
                      borderRadius="lg"
                    />
                    <Box
                      display="inline-block"
                      background="teal.500"
                      w="4"
                      h="4"
                      borderRadius="lg"
                    />
                  </Flex>
                </chakra.fieldset>
                <chakra.fieldset>
                  <Box
                    as="legend"
                    fontSize="md"
                    color={useColorModeValue('neutral.900', 'neutral.50')}
                  >
                    Tab position
                    <Text fontSize="sm" color={useColorModeValue('neutral.500', 'neutral.400')}>
                      Where should the tabs be positioned
                    </Text>
                  </Box>
                  <RadioGroup
                    fontSize="sm"
                    color={useColorModeValue('neutral.700', 'neutral.50')}
                    mt={4}
                  >
                    <Stack spacing={4}>
                      <Radio spacing={3} value="top">
                        Top
                      </Radio>
                      <Radio spacing={3} value="bottom">
                        Bottom
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </chakra.fieldset>
                <chakra.fieldset>
                  <Flex alignItems="start">
                    <Flex alignItems="center" h={5}>
                      <Checkbox id="comments" rounded="md" />
                    </Flex>
                    <Box ml={3} fontSize="sm">
                      <chakra.label
                        htmlFor="comments"
                        fontWeight="md"
                        color={useColorModeValue('neutral.700', 'neutral.50')}
                      >
                        Send statistics and crash reports
                      </chakra.label>
                      <Text color={useColorModeValue('neutral.500', 'neutral.400')}>
                        Get notified when someones posts a comment on a posting.
                      </Text>
                    </Box>
                  </Flex>
                </chakra.fieldset>
                <chakra.fieldset>
                  <Box
                    as="legend"
                    fontSize="md"
                    mb="2"
                    color={useColorModeValue('neutral.900', 'neutral.50')}
                  >
                    Text Editor
                    <Text fontSize="sm" color={useColorModeValue('neutral.500', 'neutral.400')}>
                      Which text editor to use when editing Jots inline
                    </Text>
                  </Box>
                  <Select variant="filled">
                    <option value="Monaco Editor">Monaco Editor</option>
                    <option value="CodeMirror">CodeMirror</option>
                    <option value="Textarea">Textarea</option>
                  </Select>
                </chakra.fieldset>
                <chakra.fieldset>
                  <Box
                    as="legend"
                    fontSize="md"
                    mb="2"
                    color={useColorModeValue('neutral.900', 'neutral.50')}
                  >
                    Avatar Type
                    <Text fontSize="sm" color={useColorModeValue('neutral.500', 'neutral.400')}>
                      Which avatar type to use
                      <chakra.a
                        ml="1"
                        textDecoration="underline"
                        href="https://avatars.dicebear.com/licenses"
                      >
                        Licenses
                      </chakra.a>
                    </Text>
                  </Box>
                  <Select
                    variant="filled"
                    value={avatarType}
                    onChange={(e) =>
                      updateSettings({
                        avatarType: e.target.value as AvatarType,
                      })
                    }
                  >
                    {Object.keys(avatarTypes).map((avatarType) => (
                      <option key={avatarType} value={avatarType}>
                        {avatarType}
                      </option>
                    ))}
                  </Select>
                </chakra.fieldset>
              </Stack>
            </chakra.form>
          </GridItem>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default SettingsPage;
