/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OSProvider } from './context/OSContext';
import { Desktop } from './components/Desktop';

export default function App() {
  return (
    <OSProvider>
      <Desktop />
    </OSProvider>
  );
}
