import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { IntegTesting } from './integ.default';
import { StackResourceRenamer } from '../src/index';

describe('TestCustomNamesRename', () => {
  let stack: Stack;

  beforeEach(() => {
    let integ = new IntegTesting();
    stack = integ.stack[0];
    let counts: { [key: string]: number } = {};
    StackResourceRenamer.rename(stack, {
      rename: (_, typeName) => {
        if (counts[typeName] === undefined) {
          counts[typeName] = 0;
        }
        counts[typeName]++;
        return 'projN-serviceN-' + typeName + '-' + counts[typeName];
      },
    }, { userCustomNameOnly: false });
  });

  test('test bucket name rename', () => {
    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {
      Properties: {
        BucketName: 'projN-serviceN-Bucket-1',
      },
    });
  });

  test('test lambda function name rename', () => {
    const template = Template.fromStack(stack);
    template.hasResource('AWS::Lambda::Function', {
      Properties: {
        FunctionName: 'projN-serviceN-Function-1',
      },
    });
  });

  test('test api stage name rename', () => {
    const template = Template.fromStack(stack);
    template.hasResource('AWS::ApiGateway::Stage', {
      Properties: {
        StageName: 'projN-serviceN-Stage-1',
      },
    });
  });

  test('test api name rename', () => {
    const template = Template.fromStack(stack);
    template.hasResource('AWS::ApiGateway::RestApi', {
      Properties: {
        Name: 'projN-serviceN-RestApi-1',
      },
    });
  });

});
