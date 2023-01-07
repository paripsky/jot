import { Box } from '@jot/ui';
import { Component } from 'react';

type Props = {
  children: React.ReactNode;
  resetKey?: string;
  onErrorStateChanged?: (error: Error | null) => void;
};

class ErrorBoundary extends Component<Props, { hasError: boolean; error: string }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKey, onErrorStateChanged } = this.props;
    if (prevProps.resetKey !== resetKey) {
      this.setState({ hasError: false });
      onErrorStateChanged?.(null);
    }
  }

  componentDidCatch(error: Error) {
    const { onErrorStateChanged } = this.props;
    this.setState({ error: error.message });
    onErrorStateChanged?.(error);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <Box>{error}</Box>;
    }

    return children;
  }
}

export default ErrorBoundary;
