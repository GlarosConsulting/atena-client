import { useState, useEffect } from 'react';

type OrNull<T> = T | null;

const usePersistedState = <T = any>(
  key: string,
  initialState: OrNull<T>,
): [OrNull<T>, (value: OrNull<T>) => OrNull<T>] => {
  const [state, setState] = useState(() => {
    const storageValue = localStorage.getItem(key);

    if (storageValue) {
      return JSON.parse(storageValue);
    }

    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, (value: OrNull<T>): OrNull<T> => {
    setState(value);

    return value;
  }];
};

export default usePersistedState;
