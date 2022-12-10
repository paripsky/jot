import React, { createContext, useContext, useMemo, useState } from 'react';

type StateProviderProps = {
  children?: React.ReactNode;
};

type ActionOptions<T, H> = {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
} & H;

type CreateStoreOptions<T, K, H> = {
  initialState: T | (() => T);
  actions: K;
  useHooks?: () => H;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionFunction<T, H> = (options: ActionOptions<T, H>, ...args: any[]) => void | Promise<void>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

type Actions<T, H> = {
  [key: string]: ActionFunction<T, H>;
};

export function createStore<T, K extends Actions<T, H>, H extends Record<string, unknown>>({
  initialState,
  actions,
  useHooks,
}: CreateStoreOptions<T, K, H>) {
  type BindedActions = { [P in keyof K]: OmitFirstArg<K[P]> };

  const ctx = {
    ...(initialState as T),
    ...(actions as unknown as BindedActions),
    ...({} as H),
  } as const;
  const stateContext = createContext<typeof ctx>(ctx);
  let providerUsed = false;
  const useStateContext = () => {
    if (!providerUsed) console.error('A provider must be used so that context is accessible');
    return useContext(stateContext);
  };

  function StateProvider({ children }: StateProviderProps) {
    providerUsed = true;
    const [state, setState] = useState<T>(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const hooks = useHooks?.() ?? ({} as H);

    const actionsWithState = useMemo(() => {
      return Object.entries(actions).reduce(
        (acc, [name, action]) => ({
          ...acc,
          [name]: action.bind(null, { state, setState, ...hooks }),
        }),
        actions as unknown as BindedActions,
      );
    }, [state, setState, hooks]);

    return (
      <stateContext.Provider
        value={{
          ...state,
          ...actionsWithState,
          ...hooks,
        }}
      >
        {children}
      </stateContext.Provider>
    );
  }

  return [useStateContext, StateProvider] as const;
}
