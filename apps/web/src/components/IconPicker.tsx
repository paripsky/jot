import { range } from '@/utils/array';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	IconButton,
	SimpleGrid,
	PopoverProps,
} from '@chakra-ui/react';
import React from 'react';

const emojiRanges = [
	[128513, 128591],
	[9986, 10160],
	[128640, 128704],
	// [9410, 127569],
];

const emojis = emojiRanges.flatMap(([from, to]) =>
	range(from, to).flatMap((emoji) => String.fromCodePoint(emoji)),
);

export type IconPickerProps = {
	value: string;
	onChange: (newValue: string) => void;
} & PopoverProps;

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, ...props }) => {
	return (
		<Popover isLazy {...props}>
			{({ onClose }: { onClose: () => void }) => (
				<>
					<PopoverTrigger>
						<IconButton
							size="xs"
							display="inline"
							variant="ghost"
							mr="2"
							icon={<>{value}</>}
							aria-label="Jot Icon"
						/>
					</PopoverTrigger>
					<PopoverContent w="full" overflow="auto" maxH="sm">
						<PopoverBody>
							<SimpleGrid columns={8} spacing={1}>
								{emojis.map((emoji) => (
									<IconButton
										key={emoji}
										size="sm"
										variant="ghost"
										aria-label={`Icon ${emoji}`}
										icon={<>{emoji}</>}
										onClick={() => {
											onChange(emoji);
											onClose();
										}}
									/>
								))}
							</SimpleGrid>
						</PopoverBody>
					</PopoverContent>
				</>
			)}
		</Popover>
	);
};

export default IconPicker;
