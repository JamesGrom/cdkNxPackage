import { BuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';

import { Executors, ParsedExecutorInterface } from '../interfaces';
import { parseArgs } from '../../utils/executor.util';

export interface ParsedBuildExecutorArgs extends ParsedExecutorInterface {
  parseArgs?: Record<string, string>;
  branch: string;
  app?: string;
  sourceRoot: string;
  root: string;
}
export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for Build', options);
  const normalizedArgs = normalizeArgs(options, context);
  const result = await runBuild(normalizedArgs, context);
  return {
    success: result,
  };
}
async function runBuild(
  options: ParsedBuildExecutorArgs,
  context: ExecutorContext
): Promise<boolean> {
  return false;
}

function normalizeArgs(
  options: BuildExecutorSchema,
  context: ExecutorContext
): ParsedBuildExecutorArgs {
  let branch: string;
  const parsedArgs = parseArgs(Executors.Build, options);
  if (Object.prototype.hasOwnProperty.call(parsedArgs, 'branch')) {
    branch = parsedArgs.branch;
  }
  const currentConfig =
    context?.workspace?.projects?.[context.projectName ?? ''];
  const { sourceRoot, root } = currentConfig;
  return {
    ...options,
    parseArgs: parsedArgs,
    branch,
    root,
    sourceRoot,
  };
}
