import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit';
import * as path from 'path';

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { getStackNameForCurrentGitBranch } from '../../utils/getCurrentBranch';
import { Commands } from '../interfaces';
import { ServeExecutorSchema } from './schema';

export interface ParsedServeExecutorArgs {
  sourceRoot: string;
  stackName: string;
  logFile: string;
  envFile: string;
  templateFile: string;
  offsetFromRoot: string;
  root: string;
}
export default async function runExecutor(
  options: ServeExecutorSchema,
  context: ExecutorContext
) {
  console.log(
    `Executor running for Serve with config = ${context.configurationName}`,
    options
  );
  const normailzedArgs = await normalizeArgs(options, context);
  const result = await runServe(normailzedArgs, context);
  return {
    success: result,
  };
}
async function runServe(
  options: ParsedServeExecutorArgs,
  context: ExecutorContext
): Promise<boolean> {
  const t = createCommand(Commands.serve, options);
  return runCommandProcess(t, path.join(context.root, options.root));
}
async function normalizeArgs(
  options: ServeExecutorSchema,
  context: ExecutorContext
): Promise<ParsedServeExecutorArgs> {
  const gitBasedStackName = await getStackNameForCurrentGitBranch(
    options.gitBranchToCorrespondingStackName ?? {}
  );
  const currentConfig =
    context?.workspace?.projects?.[context.projectName ?? ''];
  const { sourceRoot, root } = currentConfig;
  const offset = offsetFromRoot(`apps/${context.projectName}`);
  console.log(offset);
  return {
    ...options,
    stackName: gitBasedStackName,
    templateFile:
      options.templateFile ??
      `dist/apps/${gitBasedStackName}/local-template.yaml`,
    envFile: options.envFile ?? `libs/from${gitBasedStackName}/env/env.json`,
    logFile: options.logFile ?? 'logs.txt',
    offsetFromRoot: offset,
    root,
    sourceRoot,
  };
}
