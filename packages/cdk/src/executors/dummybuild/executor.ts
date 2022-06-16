import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit';
import * as fs from 'fs';

import { DummybuildExecutorSchema } from './schema';

export interface NormalizedDummyBuildOptions extends DummybuildExecutorSchema {
  sourceRoot: string;
  offsetFromRoot: string;
  root: string;
  projectName: string;
}
export default async function runExecutor(
  options: DummybuildExecutorSchema,
  context: ExecutorContext
) {
  const normOptions = normailzeArgs(options, context);
  console.log('Executor ran for Dummybuild', normOptions);
  for (const filepath in normOptions.filesToFillWithDummyData) {
    writeEmptyDataToFilePath(filepath);
  }
  return {
    success: true,
  };
}

const normailzeArgs = (
  options: DummybuildExecutorSchema,
  context: ExecutorContext
): NormalizedDummyBuildOptions => {
  const currentConfig =
    context?.workspace?.projects?.[context.projectName ?? ''];
  const { sourceRoot, root } = currentConfig;
  const offset = offsetFromRoot(`apps/${context.projectName}`);
  return {
    sourceRoot,
    root,
    offsetFromRoot: offset,
    projectName: context.projectName,
    ...options,
  };
};

const writeEmptyDataToFilePath = (filePath: string) => {
  fs.closeSync(fs.openSync(filePath, 'w'));
};
