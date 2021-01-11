import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeTaxRate(event, context) {

  const { id } = event.pathParameters;
  const { withholdingTexRate } = event.body;

  const params = {
      TableName: process.env.FIXED_DEPOSITS_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set highestTaxRate.withholdingTexRate = :withholdingTexRate',
      ExpressionAttributeValues: {
        ':withholdingTexRate': withholdingTexRate,
      },
      ReturnValues: 'ALL_NEW',
  };
  
  let update_fixed_deposit;

  try{
    const result = await dynamodb.update(params).promise();
    update_fixed_deposit = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({update_fixed_deposit}),
  };
}

export const handler = commonMiddleware(placeTaxRate);


