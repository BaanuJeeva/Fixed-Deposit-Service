/*
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function calculateResults(event, context) {
  let fixed_deposit;
  const { id } = event.pathParameters;
  const {prnamnt} = event.body;
  const { intrate  } = event.body;
  const { period  } = event.body;
  const { wht   } = 10;

  var total = prnamnt + (prnamnt * intrate * (100 - wht) / 10000);
  for (let i = 1; i < period; i++) {
    total = total + (total * intrate * (100 - wht) / 10000);
  }
  const totInterest = total - prnamnt;


  const now = new Date();

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
    body: JSON.stringify({cal_results}),
  };
}

export const handler = commonMiddleware(calculateResults);
*/
