import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class IntegTesting {
  readonly stack: Stack[];
  constructor() {
    const app = new App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new Stack(app, 'integration-stack', { env });

    //for integration test
    this.stack = [stack];

    //resources in stack
    const bucket = new Bucket(stack, 'WidgetStore', {
      bucketName: 'widget-store-bucket',
    });

    const handler = new Function(stack, 'WidgetHandler', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      functionName: 'handler_func',
      code: Code.fromInline(`
                exports.handler = async (event)=> {
                    console.log('event: ',event,' env: ',process.env);
                }
            `),
      environment: {
        BUCKET: bucket.bucketName,
      },
    });

    bucket.grantReadWrite(handler);

    const api = new RestApi(stack, 'widgets-api', {
      restApiName: 'Widget Service',
      description: 'serves widgets',
    });

    const getBind = new LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{"statusCode": "200"}' },
    });

    api.root.addMethod('GET', getBind, {
      operationName: 'get-widget',
    });

    new CfnOutput(stack, 'Dns', {
      exportName: 'ApiDns',
      value: api.url,
    });
  }
}

new IntegTesting();
