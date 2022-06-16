import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit';
import { DummybuildExecutorSchema } from './schema';

export interface NormalizedDummyBuildOptions {
  sourceRoot: string;
  offsetFromRoot: string;
  root: string;
  projectName: string;
}
export default async function runExecutor(
  options: DummybuildExecutorSchema,
  context: ExecutorContext
) {
  const normOptions = normailzeArgs(options, context);
  console.log('Executor ran for Dummybuild', normOptions);
  return {
    success: true,
  };
}

const normailzeArgs = (
  options: DummybuildExecutorSchema,
  context: ExecutorContext
): NormalizedDummyBuildOptions => {
  const currentConfig =
    context?.workspace?.projects?.[context.projectName ?? ''];
  const { sourceRoot, root } = currentConfig;
  const offset = offsetFromRoot(`apps/${context.projectName}`);
  return {
    sourceRoot,
    root,
    offsetFromRoot: offset,
    projectName: context.projectName,
    ...options,
  };
};
