import { ExecutorContext } from '@nrwl/devkit';
import path = require('path');

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { Commands } from '../interfaces';
import { SynthExecutorSchema } from './schema';

export interface ParsedSynthExecutorArgs {
  stackName: string;
  sourceRoot: string;
  root: string;
}
export default async function runExecutor(
  options: SynthExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor running for Synth', options);
  const normalizedArgs = normalizeArgs(options, context);
  const result = await runSynth(normalizedArgs, context);
  return {
    success: result,
  };
}
async function runSynth(
  options: ParsedSynthExecutorArgs,
  context: ExecutorContext
): Promise<boolean> {
  const t = createCommand(Commands.synth, options);
  return runCommandProcess(t, path.join(context.root, options.root));
}

function normalizeArgs(
  options: SynthExecutorSchema,
  context: ExecutorContext
): ParsedSynthExecutorArgs {
  const stackName: string = options.stackName;
  const checkStackNameConvention = /^authillo-[a-z]*$/;
  if (stackName.match(checkStackNameConvention).length !== 1)
    throw 'invalid stackname used';
  const currentConfig =
    context?.workspace?.projects?.[context.projectName ?? ''];
  const { sourceRoot, root } = currentConfig;
  return {
    ...options,
    stackName,
    root,
    sourceRoot,
  };
}
