import { BuildExecutorSchema } from './schema';
import { ExecutorContext } from '@nrwl/devkit';

import { ParsedExecutorInterface } from '../interfaces';

export default async function runExecutor(
  options: BuildExecutorSchema,
  context: ExecutorContext
) {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}

function normalizeArgs(options: BuildExecutorSchema, context: ExecutorContext) {
  // const c
}
