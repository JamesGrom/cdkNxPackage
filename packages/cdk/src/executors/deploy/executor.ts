import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit';
import path = require('path');

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { Commands } from '../interfaces';
import { DeployExecutorSchema } from './schema';

export interface ParsedDeployExecutorArgs {
  stackName: string;
  sourceRoot: string;
  offsetFromRoot: string;
  root: string;
  projectName: string;
}
export default async function runExecutor(
  options: DeployExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor running for Deploy', options);
  const normalizedArgs = normalizeArgs(options, context);
  const result = await runDeploy(normalizedArgs, context);
  return {
    success: result,
  };
}
async function runDeploy(
  options: ParsedDeployExecutorArgs,
  context: ExecutorContext
): Promise<boolean> {
  const t = createCommand(Commands.deploy, options);
  return runCommandProcess(t, path.join(context.root, options.root));
}

function normalizeArgs(
  options: DeployExecutorSchema,
  context: ExecutorContext
): ParsedDeployExecutorArgs {
  const stackName: string = options.stackName;
  const checkStackNameConvention = /^authillo-[a-z]*$/;
  if (stackName.match(checkStackNameConvention).length !== 1)
    throw 'invalid stackname used';
  const currentConfig =
    context?.workspace?.projects?.[context.projectName ?? ''];
  const { sourceRoot, root } = currentConfig;
  const offset = offsetFromRoot(`apps/${context.projectName}`);
  console.log(offset);
  return {
    ...options,
    stackName,
    offsetFromRoot: offset,
    root,
    projectName: context.projectName ?? '',
    sourceRoot,
  };
}
