/**
 * Fields in a request to update a single TASK item.
 */
export interface UpdateTaskRequest {
  name: string
  text: string
  dueDate: string
  done: boolean
}