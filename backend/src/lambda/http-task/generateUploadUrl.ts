import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { generateTaskUploadUrl } from '../../business-logic/tasks-crud'
import { createLogger } from '../../utils/logger'

const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }

const generateUploadUrlLogger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  generateUploadUrlLogger.info('Processing event', { event })

  const itemId = event.pathParameters.taskId

  if (!itemId) {
    const message = 'Missing item Id'

    generateUploadUrlLogger.error(message)

    return {
      statusCode: 400,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error: 'Missing item Id' })
    }
  }

  let uploadUrl: string;

  try {
    uploadUrl = generateTaskUploadUrl(itemId)
  } catch (error) {
    generateUploadUrlLogger.error('Error while trying to sign url s3', { error })

    return {
      statusCode: 500,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error })
    }
  }

  return {
    statusCode: 200,
    headers: accessControlAllowOrigin,
    body: JSON.stringify({ uploadUrl })
  }
}
