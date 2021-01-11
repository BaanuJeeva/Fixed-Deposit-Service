import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getFixedDeposit(event, context) {
  let fixed_deposit;
  const { id } = event.pathParameters;

  try{
    const result = await dynamodb.get({
        TableName: process.env.FIXED_DEPOSITS_TABLE_NAME,
        Key: { id },
    }).promise();

    fixed_deposit = result.Item;
  } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }

  if(!fixed_deposit) {
      throw new createError.NotFound('Order with ID "${id}" not found!');
  }

  return {
    statusCode: 200,
    body: JSON.stringify({fixed_deposit}),
  };
}

export const handler = commonMiddleware(getFixedDeposit);


