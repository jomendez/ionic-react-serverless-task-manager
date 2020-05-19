import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'


const updateUserLogger = createLogger('updateUser')
const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  updateUserLogger.info('Processing event', { event })

  const userId = event.pathParameters.userId

  if (!userId) {
    const message = 'Missing userId'

    updateUserLogger.error(message)

    return {
      statusCode: 400,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error: message })
    }
  }

  


  return {
    statusCode: 200,
    headers: accessControlAllowOrigin,
    body: JSON.stringify({})
  }
}
