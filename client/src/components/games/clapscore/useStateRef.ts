import {
  useState,
  useRef,
  useEffect,
  MutableRefObject,
  SetStateAction,
  Dispatch,
} from 'react';

function useStateRef<T>(
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, MutableRefObject<T>] {
  const [value, setValue] = useState<T>(initialValue);

  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
}

export default useStateRef;
