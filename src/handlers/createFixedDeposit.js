import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
//import middy from '@middy/core';
//import httpJsonBodyParser from '@middy/http-json-body-parser';
//import httpEventNormalizer from '@middy/http-event-normalizer';
//import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createFixedDeposit(event, context) {
  const { principalAmount } = event.body;
  const { depositPeriodInMonths } = event.body;
  const { interestRate } = event.body;
  const now = new Date();

  const { email } = event.requestContext.authorizer;
//ADDED PROPERTIES IN FIXED DEPOSIT OBJECT
  const fixed_deposit = {
    id: uuid(),
    userId:email,
    principalAmount,
    depositPeriodInMonths,
    interestRate,
    createdAt: now.toISOString(),
    highestTaxRate: {
     withholdingTexRate: 0,
    },
  };

  try{
    await dynamodb.put({
      //TableName: 'ServingAccountsTable',
      TableName: process.env.FIXED_DEPOSITS_TABLE_NAME,
      Item: fixed_deposit,
    }).promise();
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({fixed_deposit}),
  };
}


export const handler = commonMiddleware(createFixedDeposit);




/*
export const handler = middy(createOrder)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
  */








