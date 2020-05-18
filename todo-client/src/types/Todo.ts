export interface Todo {
  todoId: string
  createdAt: string
  name: string
  text: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
