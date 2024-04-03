## Originial repository that works for CDK v1: https://github.com/yglcode/cdk-stack-resource-rename

## StackResourceRenamer for CDK v2 for typescript

#### A CDK aspect, StackResourceRenamer renames CDK stack name and stack's subordinate resources' physical names, so that a CDK stack can be used to create multiple stacks in same AWS environment without confliction.

Two main use cases:

1. rename custom resources names in stack, so that stack can be reused and replicated:

```ts
StackResourceRenamer.rename(stack, {
  rename: (resName, _) => {
    return resName + "-" + alias;
  },
});
```

2. for resources without custom name, which by default will use unique id AWS auto generate as its physical id, we can create a more readable and identifiable name, for testing, debugging or metrics monitoring environments.

```ts
StackResourceRenamer.rename(
  stack,
  {
    rename: (_, typeName) => {
      counts[typeName]++;
      return (
        projectName +
        "-" +
        serviceName +
        "-" +
        typeName +
        "-" +
        counts[typeName]
      );
    },
  },
  { userCustomNameOnly: false }
);
```

### Samples

_typescript_

```ts
import { StackResourceRenamer } from 'cdk-stack-resource-rename';

const app = new core.App();
const stack = new core.Stack(app, 'my-stack');

let alias = stack.node.tryGetContext('alias');
if (alias) {
    //if alias is defined, rename stack and resources' custom names
    StackResourceRenamer.rename(stack, {
        rename: (resName, _)=>{
            return resName+'-'+alias;
        },
    });
}

//resources in stack
const bucket = new s3.Bucket(stack, 'bucket', {
    bucketName: 'my-bucket',
});
...
```

To create multiple stacks:

`cdk -c alias=a1 deploy  `
will create a stack: my-stack-a1 with my-bucket-a1.

To create more stacks: my-stack-a2 with my-bucket-a2, my-stack-a3 with my-bucket-a3:

`cdk -c alias=a2 deploy`

`cdk -c alias=a3 deploy`
