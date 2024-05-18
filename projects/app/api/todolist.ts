import type { TodoList } from "@prisma/client"
import useStore from "~/stores"

export function GetAll() {
  const store = useStore()
  return useFetch<TodoList[]>(
    '/api/todolist/all',
    {
      headers: {
        'Authorization': 'Bearer ' + store.token
      }
    }
  )
}
