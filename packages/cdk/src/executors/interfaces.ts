export interface ParsedExecutorInterface {
  parseArgs?: Record<string, string>;
  stacks?: string[];
  app?: string;
  sourceRoot: string;
  root: string;
}

export enum KeysForBuildExecutorProps {
  stacks = 'stacks',
}
type baseBuildExecutorProps = {
  [KeyName in KeysForBuildExecutorProps]: any;
};
// type t = {
// }

// type PropsForBuildExecutor extends {[T keyof KeysForBuildExecutorProps]: any}
export interface PropsForBuildExecutor extends baseBuildExecutorProps {
  stacks: string[];
}
export enum Executors {
  Build = 'Build',
  Deploy = 'Deploy',
}
