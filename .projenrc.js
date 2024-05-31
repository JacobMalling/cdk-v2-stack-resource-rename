const { AwsCdkConstructLibrary } = require('projen/lib/awscdk');
const { NodePackageManager, NpmAccess } = require('projen/lib/javascript');

const project = new AwsCdkConstructLibrary({
  npmAccess: NpmAccess.PUBLIC,
  author: 'KeyShot',
  authorAddress: 'open-source-maintainers@keyshot.com',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.135.0',
  name: 'cdk-v2-stack-resource-rename-typescript',
  repositoryUrl: 'https://github.com/luxionkeyshot/cdk-v2-stack-resource-rename-NODEJS.git',
  license: 'Apache-2.0',
  deps: [
    'aws-cdk-lib',
    'constructs',
  ],
  constructsVersion: '10.3.0',
  packageManager: NodePackageManager.NPM,
  jestOptions: {
    jestConfig: {
      testMatch: ['<rootDir>/**/*.test.ts'],
    },
  },
});

project.synth();
