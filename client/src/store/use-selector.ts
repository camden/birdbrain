import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux';
import { ClientState } from './types';

const useSelector: TypedUseSelectorHook<ClientState> = useReduxSelector;
export default useSelector;
