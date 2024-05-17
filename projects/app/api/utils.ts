import type { UseFetchOptions } from "#app"
import useStore from "~/stores"

export function useFetchwithToken<T>(url: string, options?: UseFetchOptions<T>) {
  const store = useStore()
  return useFetch(url, {
    ...options,
    headers: {
      'Authorization': 'Bearer ' + store.token
    }
  })
}
