/**
 * Fields in a request to create a single TASK item.
 */
export interface CreateTaskRequest {
  name: string
  text: string
  dueDate: string
}
