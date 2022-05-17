import { ExecutorContext, offsetFromRoot, readJsonFile } from '@nrwl/devkit';
import path = require('path');

import { createCommand, runCommandProcess } from '../../utils/executor.util';
import { Commands } from '../interfaces';
import { BuildEnvExecutorSchema } from './schema';

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
}
export default async function runExecutor(
  options: BuildEnvExecutorSchema,
  context: ExecutorContext
) {
  console.log(
    `Executor running for Synth with config = ${context.configurationName} , options = ${options}`,
    options
  );
  console.log(`reading file at: ${context.cwd}`);
  const filePath =
    context.cwd + `/libs/${context.projectName}/${options.cdkOutputsFileName}`;
  const t = readJsonFile(filePath);
  console.log(`file object = ${JSON.stringify(t)}`);
  return { success: true };
  // switch (context.configurationName) {
  //   case 'local': {
  //     const normailzedArgs = normalizeLocalArgs(options, context);
  //     const result = await runBuildEnvLocal(normailzedArgs, context);
  //     return {
  //       success: result,
  //     };
  //   }
  //   default: {
  //     const normalizedArgs = normalizeArgs(options, context);
  //     const result = await runBuildEnv(normalizedArgs, context);
  //     return {
  //       success: result,
  //     };
  //   }
  // }
}
// async function runBuildEnv(
//   options: ParsedSynthExecutorArgs,
//   context: ExecutorContext
// ): Promise<boolean> {
//   const t = createCommand(Commands.synth, options);
//   return runCommandProcess(t, path.join(context.root, options.root));
// }
// function normalizeArgs(
//   options: BuildEnvExecutorSchema,
//   context: ExecutorContext
// ): ParsedSynthExecutorArgs {
//   const stackName: string = options.stackName ?? options.defaultStackName;
//   const stackNameRegexString = options.stackNameRegexString;
//   if (
//     stackNameRegexString != null &&
//     (stackName.match(RegExp(stackNameRegexString))?.length ?? 0) < 1
//   )
//     throw 'invalid stackname used';
//   const currentConfig =
//     context?.workspace?.projects?.[context.projectName ?? ''];
//   const { sourceRoot, root } = currentConfig;

//   return {
//     ...options,
//     stackName,
//     root,
//     sourceRoot,
//   };
// }

// async function runBuildEnvLocal(
//   options: ParsedSynthLocalExecutorArgs,
//   context: ExecutorContext
// ): Promise<boolean> {
//   const t = createCommand(Commands.synthLocal, options);
//   return runCommandProcess(t, path.join(context.root, options.root));
// }
// function normalizeLocalArgs(
//   options: BuildEnvExecutorSchema,
//   context: ExecutorContext
// ): ParsedSynthLocalExecutorArgs {
//   const stackName: string = options.stackName ?? options.defaultStackName;
//   const stackNameRegexString = options.stackNameRegexString;
//   if (
//     stackNameRegexString != null &&
//     (stackName.match(RegExp(stackNameRegexString))?.length ?? 0) < 1
//   )
//     throw 'invalid stackname used';
//   const currentConfig =
//     context?.workspace?.projects?.[context.projectName ?? ''];
//   const { sourceRoot, root } = currentConfig;
//   const offset = offsetFromRoot(`apps/${context.projectName}`);
//   console.log(offset);
//   return {
//     ...options,
//     stackName,
//     offsetFromRoot: offset,
//     root,
//     projectName: context.projectName ?? '',
//     sourceRoot,
//   };
// }
