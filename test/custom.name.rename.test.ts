import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { IntegTesting } from './integ.default';
import { StackResourceRenamer } from '../src/index';

describe('TestCustomNamesRename', () => {
  let stack: Stack;

  beforeEach(() => {
    let integ = new IntegTesting();
    stack = integ.stack[0];
    let alias = 'xxx';
    StackResourceRenamer.rename(stack, {
      rename: (origName, _) => {
        return origName + '-' + alias;
      },
    });
  });

  test('test bucket name rename', () => {
    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {
      Properties: {
        BucketName: 'widget-store-bucket-xxx',
      },
    });
  });

  test('test lambda function name rename', () => {
    const template = Template.fromStack(stack);
    template.hasResource('AWS::Lambda::Function', {
      Properties: {
        FunctionName: 'handler_func-xxx',
      },
    });
  });

  test('test api stage name rename', () => {
    const template = Template.fromStack(stack);
    template.hasResource('AWS::ApiGateway::Stage', {
      Properties: {
        StageName: 'prod-xxx',
      },
    });
  });

  test('test api name rename', () => {
    const template = Template.fromStack(stack);
    template.hasResource('AWS::ApiGateway::RestApi', {
      Properties: {
        Name: 'Widget Service-xxx',
      },
    });
  });

  test('test export name rename', () => {
    const template = Template.fromStack(stack);
    console.log(template);
    template.hasOutput('Dns', {
      Export: {
        Name: 'ApiDns-xxx',
      },
    });
  });
});
