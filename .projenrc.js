const { awscdk } = require('projen');

const project = new awscdk.AwsCdkConstructLibrary({
  prerelease: 'beta',
  docgen: false,
  author: 'KeyShot',
  authorAddress: 'open-source-maintainers@keyshot.com',
  defaultReleaseBranch: 'main',
  name: 'cdk-v2-stack-resource-rename-typescript',
  repositoryUrl: 'https://github.com/luxionkeyshot/cdk-v2-stack-resource-rename-NODEJS.git',
  license: 'Apache-2.0',
  jsiiVersion: '~5.4.0',
  cdkVersion: '2.146.0',
  constructsVersion: '10.3.0',
  typescriptVersion: '4.9.5',
  jestOptions: {
    updateSnapshot: 'NEVER',
    jestConfig: {
      testMatch: ['<rootDir>/**/*.test.ts'],
    },
  },
});

project.synth();
