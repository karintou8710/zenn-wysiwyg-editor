// form from https://github.com/streamich/react-use

import { type DependencyList, useEffect } from "react";
import useTimeoutFn from "./useTimeoutFn";

export type UseDebounceReturn = [() => boolean | null, () => void];

export default function useDebounce(
  // biome-ignore lint/complexity/noBannedTypes: External library code
  fn: Function,
  ms: number = 0,
  deps: DependencyList = [],
): UseDebounceReturn {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  // biome-ignore lint/correctness/useExhaustiveDependencies: External library code
  useEffect(reset, deps);

  return [isReady, cancel];
}
