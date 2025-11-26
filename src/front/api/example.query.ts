/**
 * Example TanStack Query hooks
 *
 * Usage pattern:
 * 1. Define queryOptions for type-safe queries
 * 2. Use useSuspenseQuery for SSR data (guaranteed data)
 * 3. Use useQuery for client-only data (optional data)
 * 4. Export queryOptions to use in loaders
 */

import { getTest } from '@/shared/api-client/client'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

// Example: Query keys factory
export const exampleKeys = {
  all: ['example'] as const,
  lists: () => [...exampleKeys.all, 'list'] as const,
  list: (filters: string) => [...exampleKeys.lists(), filters] as const,
  details: () => [...exampleKeys.all, 'detail'] as const,
  detail: (id: string) => [...exampleKeys.details(), id] as const,
}

// ✅ Query options for SSR data (can be used in loaders)
export const testQueryOptions = queryOptions({
  queryKey: exampleKeys.all,
  queryFn: () => getTest(),
})

// ✅ useSuspenseQuery for SSR data (data is guaranteed, no undefined)
export const useGetTest = () => {
  return useSuspenseQuery(testQueryOptions)
}
// Example: GET query
// export const useExample = (id: string) => {
//   return useQuery({
//     queryKey: exampleKeys.detail(id),
//     queryFn: () => exampleApi.getById(id),
//     enabled: !!id,
//   })
// }

// Example: POST mutation
// export const useCreateExample = () => {
//   const queryClient = useQueryClient()
//
//   return useMutation({
//     mutationFn: exampleApi.create,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: exampleKeys.lists() })
//     },
//   })
// }
