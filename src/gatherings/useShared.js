import { useEffect, useState } from 'react';
import { subscribe } from './sim.js';

// Re-reads the shared list whenever it changes, in this tab or another one.
export function useShared(read, deps = []) {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
  return read(); // eslint-disable-line react-hooks/exhaustive-deps
}
