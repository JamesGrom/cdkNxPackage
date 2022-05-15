import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit';
import path = require('path');

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { Commands } from '../interfaces';
import { LocalExecutorSchema } from './schema';

export interface ParsedSynthLocalExecutorArgs {
  stackName: string;
  sourceRoot: string;
  offsetFromRoot: string;
  root: string;
  projectName: string;
}
export default async function runExecutor(
  options: LocalExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor running for Local', options);
  const normalizedArgs = normalizeArgs(options, context);
  const result = await synthLocal(normalizedArgs, context);
  return {
    success: result,
  };
}
async function synthLocal(
  options: ParsedSynthLocalExecutorArgs,
  context: ExecutorContext
): Promise<boolean> {
  const t = createCommand(Commands.synthLocal, options);
  return runCommandProcess(t, path.join(context.root, options.root));
}

function normalizeArgs(
  options: LocalExecutorSchema,
  context: ExecutorContext
): ParsedSynthLocalExecutorArgs {
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
