const { AwsCdkConstructLibrary } = require('projen/lib/awscdk');
const { NodePackageManager } = require('projen/lib/javascript');

const project = new AwsCdkConstructLibrary({
  author: 'Jacob Malling-Olesen',
  authorAddress: 'jacob.malling.olesen@gmail.com',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.135.0',
  name: 'cdk-v2-stack-resource-rename',
  repositoryUrl: 'https://github.com/JacobMalling/cdk-v2-stack-resource-rename.git',
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
