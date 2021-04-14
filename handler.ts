import { Lambda } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';
import { sendWebhook } from './discord';
import { getTotalDeposit } from './terra';


export const handler = async (event: APIGatewayEvent) => {
    const arn = process.env.ARN;
    if(!arn) throw new Error(`Undefined .env value: 'arn'`)
    if(!process.env.ACCESS_KEY || !process.env.SECRET_KEY) throw new Error(`Undefined .env value: '${process.env.SECRET_KEY}' '${process.env.ACCESS_KEY}'`);
    if(!process.env.TERRA_ADDR) throw new Error(`Undefined .env value: 'TERRA_ADDR'`);
    if(!process.env.WEBHOOK) throw new Error(`Undefined .env value: 'WEBHOOK'`);
    if(!process.env.LAST_BALANCE) throw new Error(`Undefined .env value: 'LAST_BALANCE'`);
    const lastBalance = parseFloat(process.env.LAST_BALANCE);
    console.log(`Getting deposit...`);
    const balance = await getTotalDeposit();
    console.log(`Deposit ${balance}`);
    const params = {
      FunctionName: arn, 
      MemorySize: 256,
      Environment: {
        Variables: {
          'LAST_AT': Date.now().toString(),
          'ACCESS_KEY': process.env.ACCESS_KEY,
          'SECRET_KEY': process.env.SECRET_KEY,
          'ARN': arn,
          'TERRA_ADDR': process.env.TERRA_ADDR,
          'LAST_BALANCE': balance,
          'WEBHOOK': process.env.WEBHOOK,
          'ROLE': process.env.ROLE ? (process.env.ROLE !== '' ? process.env.ROLE : '') : ''
        }
      }
    };
    const lambda = new Lambda({accessKeyId: process.env.ACCESS_KEY, secretAccessKey: process.env.SECRET_KEY,region: 'eu-west-3'});
    const data = await lambda.updateFunctionConfiguration(params).promise();
    console.info(data);
    console.log(`Sending balance...`);
    await sendWebhook({balance: balance, lastBalance: lastBalance.toString()});
    console.log(`Sent balance!`);
    return {
        statusCode: 200,
        body: {env: process.env.AWS_EXECUTION_ENV, els: 'he'},
    };
}