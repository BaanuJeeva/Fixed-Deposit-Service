import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getFixedDeposits(event, context) {
  let fixed_deposits;

  try{
    const result = await dynamodb.scan({ 
        TableName: process.env.FIXED_DEPOSITS_TABLE_NAME,
    }).promise();

    fixed_deposits = result.Items;
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);  
  }

  return {
    statusCode: 200,
    body: JSON.stringify({fixed_deposits}),
  };
}

export const handler = commonMiddleware(getFixedDeposits);



