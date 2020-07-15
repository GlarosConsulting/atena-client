import { useState, useEffect } from 'react';

const usePersistedState = <T = any>(
  _key: string,
  initialState: T,
): [T, React.Dispatch<T>] => {
  const key = `@Atena/${_key}`;

  const [state, setState] = useState(() => {
    const storagedValue = localStorage.getItem(key);

    if (storagedValue) {
      return JSON.parse(storagedValue);
    }

    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export default usePersistedState;
