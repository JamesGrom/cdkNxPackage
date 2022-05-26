import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit';
import * as path from 'path';

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { getStackNameForCurrentGitBranch } from '../../utils/getCurrentBranch';
import { Commands } from '../interfaces';
import { SynthExecutorSchema } from './schema';

export interface ParsedSynthExecutorArgs {
  stackName: string;
  sourceRoot: string;
  root: string;
}
export interface ParsedSynthLocalExecutorArgs {
  stackName: string;
  sourceRoot: string;
  offsetFromRoot: string;
  root: string;
  projectName: string;
  nostaging: boolean;
}
export default async function runExecutor(
  options: SynthExecutorSchema,
  context: ExecutorContext
) {
  console.log(
    `Executor running for Synth with config = ${context.configurationName}`,
    options
  );
  if (options.local) {
    const normailzedArgs = await normalizeLocalArgs(options, context);
    const result = await runSynthLocal(normailzedArgs, context);
    return {
      success: result,
    };
  }
  const normalizedArgs = await normalizeArgs(options, context);
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
async function normalizeArgs(
  options: SynthExecutorSchema,
  context: ExecutorContext
): Promise<ParsedSynthExecutorArgs> {
  const gitBasedStackName = await getStackNameForCurrentGitBranch(
    options.gitBranchToCorrespondingStackName ?? {}
  );
  const stackName: string = gitBasedStackName;
  const stackNameRegexString = options.stackNameRegexString;
  if (
    stackNameRegexString != null &&
    (stackName.match(RegExp(stackNameRegexString))?.length ?? 0) < 1
  )
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

async function runSynthLocal(
  options: ParsedSynthLocalExecutorArgs,
  context: ExecutorContext
): Promise<boolean> {
  const t = createCommand(Commands.synthLocal, options);
  return runCommandProcess(t, path.join(context.root, options.root));
}
async function normalizeLocalArgs(
  options: SynthExecutorSchema,
  context: ExecutorContext
): Promise<ParsedSynthLocalExecutorArgs> {
  const gitBasedStackName = await getStackNameForCurrentGitBranch(
    options.gitBranchToCorrespondingStackName ?? {}
  );
  const stackName: string = gitBasedStackName;
  const stackNameRegexString = options.stackNameRegexString;
  if (
    stackNameRegexString != null &&
    (stackName.match(RegExp(stackNameRegexString))?.length ?? 0) < 1
  )
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
