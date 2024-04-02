import { Template } from 'aws-cdk-lib/assertions';
import { StackResourceRenamer } from '../src/index';
import { IntegTesting } from './integ.default';

test('integ snapshot validation', () => {
  const integ = new IntegTesting();
  let alias = 'xxx';
  StackResourceRenamer.rename(integ.stack[0], {
    rename: (origName, _) => {
      return origName + '-' + alias;
    },
  });
  integ.stack.forEach(stack => {
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
