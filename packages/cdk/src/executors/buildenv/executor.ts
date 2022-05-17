import { ExecutorContext, readJsonFile } from '@nrwl/devkit';
import path = require('path');

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { Commands } from '../interfaces';
import { BuildEnvExecutorSchema } from './schema';
export interface ParsedBuildEnvExecutorArgs {
  local: boolean;
  root: string;
  fileName: string;
}

export default async function runExecutor(
  options: BuildEnvExecutorSchema,
  context: ExecutorContext
) {
  console.log(
    `Executor running for Synth with config = ${context.configurationName} , options = ${options}`,
    options
  );
  // console.log(`reading file at: ${context.cwd}`);
  // const filePath =
  //   context.cwd + `/libs/${context.projectName}/${options.cdkOutputsFileName}`;
  // const t = readJsonFile(filePath);
  // console.log(`file object = ${JSON.stringify(t)}`);
  if (options.local === true) {
    console.log('building local env config');
  } else {
    console.log('building non-local env config');
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
  return {
    local: options.local,
    fileName: options.cdkOutputsFileName,
    root,
  };
}
