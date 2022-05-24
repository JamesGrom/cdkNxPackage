import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit';
import * as path from 'path';

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { getStackNameForCurrentGitBranch } from '../../utils/getCurrentBranch';
import { Commands } from '../interfaces';
import { BuildEnvExecutorSchema } from './schema';
export interface ParsedBuildEnvExecutorArgs {
  stackName: string;
  root: string;
  builderFileName: string;
  fileName: string;
  cdkOutputsFile: string;
  offsetFromRoot: string;
}

export default async function runExecutor(
  options: BuildEnvExecutorSchema,
  context: ExecutorContext
) {
  console.log(
    `Executor running for BuildEnv with config = ${context.configurationName} , options = ${options}`,
    options
  );
  console.warn(
    'Env variables will match those currently deployed to the cloud. Make sure to run <backendProjectName>:deploy to update the environment variables in the cloud'
  );
  const normalizedArgs = await normalizeArgs(options, context);
  const result = await runBuildEnv(normalizedArgs, context);
  return {
    success: result,
  };
}
async function runBuildEnv(
  options: ParsedBuildEnvExecutorArgs,
  context: ExecutorContext
): Promise<boolean> {
  const t = createCommand(Commands.buildEnv, options);
  return runCommandProcess(t, path.join(context.root, options.root));
}
async function normalizeArgs(
  options: BuildEnvExecutorSchema,
  context: ExecutorContext
): Promise<ParsedBuildEnvExecutorArgs> {
  const currentConfig =
    context?.workspace?.projects?.[context.projectName ?? ''];
  const { root } = currentConfig;
  const offset = offsetFromRoot(`apps/${context.projectName}`);
  const builderFileName = getBuildFileName(options);
  const gitBasedStackName = await getStackNameForCurrentGitBranch(
    options.gitBranchToCorrespondingStackName ?? {}
  );
  return {
    stackName: gitBasedStackName,
    fileName: options.cdkOutputsFileName,
    cdkOutputsFile: options.pathToCdkOutputs ?? ``,
    builderFileName,
    offsetFromRoot: offset,
    root,
  };
}

function getBuildFileName(options: BuildEnvExecutorSchema): string {
  const key = options.whichBuilder;
  const fileName = options.whichBuilderToBuilderFilesMap[key];
  if (fileName == null) throw 'no buildFile maps to given whichBuilder param';
  return fileName;
}
