import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { withSuspense } from '@/routes';

const HTMLSandbox = React.lazy(() => import('./HTMLSandbox'));
const ReactComponentSandbox = React.lazy(() => import('./ReactComponentSandbox'));

function SandboxPage() {
  return (
    <Routes>
      <Route path="/sandbox/html" element={withSuspense(HTMLSandbox)} />
      <Route path="/sandbox/react" element={withSuspense(ReactComponentSandbox)} />
    </Routes>
  );
}

export default SandboxPage;
