const { AwsCdkConstructLibrary } = require('projen/lib/awscdk');
const { NodePackageManager } = require('projen/lib/javascript');

const project = new AwsCdkConstructLibrary({
  npmRegistryUrl: 'https://registry.npmjs.org',
  buildWorkflowOptions: {
    preBuildSteps: [
      {
        name: 'Install dependencies',
        run: 'npm install',
        env: {
          NPM_TOKEN: '${{secrets.NPM_TOKEN}}',
        },
      },
    ],
  },
  jsiiVersion: '~5.4.0',
  docgen: false,
  author: 'KeyShot',
  authorAddress: 'open-source-maintainers@keyshot.com',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.135.0',
  name: 'cdk-v2-stack-resource-rename-typescript',
  repositoryUrl: 'https://github.com/luxionkeyshot/cdk-v2-stack-resource-rename-NODEJS.git',
  license: 'Apache-2.0',
  constructsVersion: '10.3.0',
  packageManager: NodePackageManager.NPM,
  jestOptions: {
    jestConfig: {
      testMatch: ['<rootDir>/**/*.test.ts'],
    },
  },
});

project.synth();
