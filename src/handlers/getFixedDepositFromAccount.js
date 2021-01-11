import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getFixedDepositFromAccount(event, context) {
  let fixed_deposit;
//const { id } = event.pathParameters;
  const { email } = event.requestContext.authorizer;
  const params = {
    TableName: process.env.FIXED_DEPOSITS_TABLE_NAME,
    FilterExpression: "userId=:userId",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":userId": email,
    },
  };

  try {
    const result = await dynamodb.scan(params).promise();

    fixed_deposit = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(fixed_deposit),
  };
}

export const handler = commonMiddleware(getFixedDepositFromAccount);


