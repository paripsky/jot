import { Button, ButtonProps } from '@jot/ui';

import Link from './Link';

export type LinkButtonProps = ButtonProps & {
  to?: string;
};

function LinkButton({ children, to, ...rest }: LinkButtonProps) {
  return (
    <Link variant="unstyled" to={to}>
      <Button tabIndex={-1} {...rest}>
        {children}
      </Button>
    </Link>
  );
}

export default LinkButton;
