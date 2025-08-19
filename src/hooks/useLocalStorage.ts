import { useCallback, useSyncExternalStore } from "react";

export const CONTENT_KEY = "content";

export function useLocalStorage(key: string, initialValue: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
          callback();
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    },
    [key],
  );

  const getSnapshot = useCallback((): string => {
    try {
      const item = window.localStorage.getItem(key);
      return item || initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot);

  const setValue = useCallback(
    (newValue: string) => {
      try {
        window.localStorage.setItem(key, newValue);
        // Manually trigger storage event for same-tab updates
        window.dispatchEvent(new StorageEvent("storage", { key }));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key],
  );

  return [value, setValue] as const;
}
