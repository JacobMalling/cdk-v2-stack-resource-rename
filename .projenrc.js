const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  jsiiVersion: '~5.4.0',
  docgen: false,
  author: 'KeyShot',
  authorAddress: 'open-source-maintainers@keyshot.com',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.146.0',
  name: 'cdk-v2-stack-resource-rename-typescript',
  repositoryUrl: 'https://github.com/luxionkeyshot/cdk-v2-stack-resource-rename-NODEJS.git',
  license: 'Apache-2.0',
  constructsVersion: '10.3.0',
  jestOptions: {
    updateSnapshot: 'NEVER',
    jestConfig: {
      testMatch: ['<rootDir>/**/*.test.ts'],
    },
  },
});

project.synth();
