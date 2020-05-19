export interface TaskItem {
  userId: string
  taskId: string
  createdAt: string
  name: string
  text: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
