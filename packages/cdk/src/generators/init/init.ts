import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  Tree,
} from '@nrwl/devkit';
import {
  DEFAULT_CDK_VERSION,
  DEFAULT_CDK_CLI_VERSION,
  DEFAULT_APPSYNC_TRANSFORMER_VERSION,
  DEFAULT_APPSYNC_VERSION,
} from '../../sharedVars';
import { InitCdkOptions } from './schema';
function normalizeArgs(schema: InitCdkOptions) {
  return {
    ...schema,
    cdkVersion:
      schema.cdkVersion != null && schema.cdkVersion !== ''
        ? schema.cdkVersion
        : DEFAULT_CDK_VERSION,
    cdkCLIVersion:
      schema.cdkCLIVersion != null && schema.cdkCLIVersion !== ''
        ? schema.cdkCLIVersion
        : DEFAULT_CDK_CLI_VERSION,
    appsyncTransformerVersion:
      schema.appsyncTransformerVersion != null &&
      schema.appsyncTransformerVersion !== ''
        ? schema.appsyncTransformerVersion
        : DEFAULT_APPSYNC_TRANSFORMER_VERSION,
    appsyncVersion:
      schema.appsyncVersion != null && schema.appsyncVersion !== ''
        ? schema.appsyncVersion
        : DEFAULT_APPSYNC_VERSION,
  };
}
export async function initGenerator(host: Tree, options: InitCdkOptions) {
  const args = normalizeArgs(options);
  console.log(`initGenerator(${host},${args})`);
  const installTask = addDependenciesToPackageJson(
    host,
    {
      'aws-cdk-lib': `${args.cdkVersion}`,
      'aws-cdk': `${args.cdkCLIVersion}`,
      '@aws-cdk/aws-appsync-alpha': `${args.appsyncVersion}`,
      'cdk-appsync-transformer': `${args.appsyncTransformerVersion}`,
      '@nrwl/js': '^13.8.3',
      '@nrwl/node': '^13.8.3',
      constructs: '^10.0.118',
      dotenv: '^16.0.0',
      'source-map-support': '^0.5.16',
    },
    {}
  );
  await formatFiles(host);
  return async () => {
    await installTask();
  };
}
export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);
