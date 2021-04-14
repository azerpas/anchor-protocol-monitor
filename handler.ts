import { Lambda } from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';


export const handler = async (event: APIGatewayEvent) => {
    const arn = process.env.ARN;
    if(!arn) throw new Error(`Undefined .env value: 'arn'`)
    if(!process.env.ACCESS_KEY || !process.env.SECRET_KEY) throw new Error(`Undefined .env value: '${process.env.SECRET_KEY}' '${process.env.ACCESS_KEY}'`)
    const params = {
      FunctionName: arn, 
      MemorySize: 256,
      Environment: {
        Variables: {
          'LAST_AT': Date.now().toString(),
          'ACCESS_KEY': process.env.ACCESS_KEY,
          'SECRET_KEY': process.env.SECRET_KEY
        }
      }
    };
    const lambda = new Lambda({accessKeyId: process.env.ACCESS_KEY, secretAccessKey: process.env.SECRET_KEY,region: 'eu-west-3'});
    const data = await lambda.updateFunctionConfiguration(params).promise();
    console.info(data);
    return {
        statusCode: 200,
        body: {env: process.env.AWS_EXECUTION_ENV, els: 'he'},
    };
}