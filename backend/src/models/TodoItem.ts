export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  text: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
