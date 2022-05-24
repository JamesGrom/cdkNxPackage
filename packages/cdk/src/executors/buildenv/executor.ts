import { ExecutorContext, offsetFromRoot, readJsonFile } from '@nrwl/devkit';
import * as path from 'path';

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { getStackNameForCurrentGitBranch } from '../../utils/getCurrentBranch';
import { Commands } from '../interfaces';
import { BuildEnvExecutorSchema } from './schema';
export interface ParsedBuildEnvExecutorArgs {
  local: boolean;
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
  if (options.local === true) {
    console.log('building local env config');
  } else {
    console.log('building non-local env config');
  }
  console.warn(
    'Env variables will match those currently deployed to the cloud. Make sure to run <backendProjectName>:deploy to update the environment variables in the cloud'
  );
  if (options.selectStackNameBasedOnCurrentGitBranch) {
    const gitBasedStackName = await getStackNameForCurrentGitBranch(
      options.gitBranchToCorrespondingStackName ?? {}
    );
    options.stackName = gitBasedStackName;
  }
  const result = await runBuildEnv(normalizeArgs(options, context), context);
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
function normalizeArgs(
  options: BuildEnvExecutorSchema,
  context: ExecutorContext
): ParsedBuildEnvExecutorArgs {
  const currentConfig =
    context?.workspace?.projects?.[context.projectName ?? ''];
  const { root } = currentConfig;
  const offset = offsetFromRoot(`apps/${context.projectName}`);
  const builderFileName = getBuildFileName(options);
  return {
    local: options.local,
    stackName: options.stackName,
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
