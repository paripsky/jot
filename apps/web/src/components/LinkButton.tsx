import { Button, ButtonProps } from '@chakra-ui/react';
import React from 'react';

import Link from './Link';

export type LinkButtonProps = ButtonProps & {
  to?: string;
};

const LinkButton: React.FC<LinkButtonProps> = ({ children, to, ...rest }) => {
  return (
    <Link variant="unstyled" to={to}>
      <Button tabIndex={-1} {...rest}>
        {children}
      </Button>
    </Link>
  );
};

export default LinkButton;
