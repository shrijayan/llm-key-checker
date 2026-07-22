import { useSyncExternalStore } from 'react'

const subscribeNever = () => () => {}

/**
 * True only once the component has mounted on the client.
 *
 * Deliberately implemented with `useSyncExternalStore` instead of the more
 * familiar `useState(false)` + `useEffect(() => setState(true), [])` pattern:
 * that pattern calls `setState` synchronously inside an effect, which
 * triggers an extra cascading render React (and the react-hooks lint rule)
 * flags as a smell. `useSyncExternalStore`'s server/client snapshot split
 * expresses the exact same "different value before/after hydration" intent
 * without ever calling `setState` by hand.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
}
