import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import { TaskItem } from '../../models/TaskItem'

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
  hosts: [esHost],
  connectionClass: httpAwsEs
})

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  console.log('Processing events batch from DynamoDB', JSON.stringify(event))

  for (const record of event.Records) {
    console.log('Processing record', JSON.stringify(record))
    if (record.eventName !== 'INSERT') {
      continue
    }

    const newItem = record.dynamodb.NewImage

    const taskId = newItem.taskId.S

    const body: TaskItem = {
      taskId: newItem.taskId.S,
      userId: newItem.userId.S,
      createdAt: newItem.createdAt.S,
      name: newItem.name.S,
      text: newItem.text.S,
      dueDate: newItem.dueDate.S,
      attachmentUrl: newItem.attachmentUrl.S,
      done: !!newItem.done.S
    }


    await es.index({
      index: 'tasks-index',
      type: 'tasks',
      id: taskId,
      body
    })

  }
}