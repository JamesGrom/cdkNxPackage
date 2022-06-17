import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit';
import * as fs from 'fs';

import { CreateplaceholderdirectoryifnonexistentExecutorSchema } from './schema';
export interface NormOptions
  extends CreateplaceholderdirectoryifnonexistentExecutorSchema {
  sourceRoot: string;
  offsetFromRoot: string;
  root: string;
  projectName: string;
}

export default async function runExecutor(
  options: CreateplaceholderdirectoryifnonexistentExecutorSchema,
  context: ExecutorContext
) {
  const normOptions = normailzeArgs(options, context);
  console.log('Executor ran for Dummybuild', normOptions);
  normOptions.directoriesThatNeedToExist.forEach((filepath) => {
    createEmptyDirectoryIfNonExistent(filepath);
  });
  return {
    success: true,
  };
}

const normailzeArgs = (
  options: CreateplaceholderdirectoryifnonexistentExecutorSchema,
  context: ExecutorContext
): NormOptions => {
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

const createEmptyDirectoryIfNonExistent = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    console.log(`creating empty directory: ${filePath}`);
    fs.mkdirSync(filePath, { recursive: true });
  }
};
