import { Icon, IconButton, IconButtonProps } from '@jot/ui';
import type { IconType } from 'react-icons';

import Link from './Link';

type SidebarButtonProps = {
  to?: string;
  title: string;
  icon: IconType;
  isActive?: boolean;
} & Omit<IconButtonProps, 'aria-label' | 'icon'>;

export function SidebarButton({ to, icon, title, isActive, ...props }: SidebarButtonProps) {
  const bg = isActive ? 'neutral.100' : 'neutral.500';
  const button = (
    <IconButton
      icon={<Icon boxSize="6" as={icon} />}
      borderRadius="none"
      size="lg"
      variant="ghost"
      color={bg}
      _hover={{
        color: 'neutral.100',
      }}
      tabIndex={to ? -1 : undefined}
      {...props}
      aria-label={title}
    />
  );

  return to ? <Link to={to}>{button}</Link> : button;
}
