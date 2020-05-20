import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getProfile } from '../../business-logic/user-crud'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const accessControlAllowOrigin = { 'Access-Control-Allow-Origin': '*' }


const getProfileLogger = createLogger('getProfile')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  getProfileLogger.info('Processing event', { event })

  let  profiles

  try {
    const userId = getUserId(event)

    profiles = await getProfile(userId)
  } catch (error) {
    getProfileLogger.error('Error while trying to get profiles', {
      error
    })

    return {
      statusCode: 500,
      headers: accessControlAllowOrigin,
      body: JSON.stringify({ error })
    }
  }

  return {
    statusCode: 200,
    headers: accessControlAllowOrigin,
    body: JSON.stringify({ items: profiles })
  }
}
