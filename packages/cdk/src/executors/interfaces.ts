export interface ParsedExecutorInterface {
  parseArgs?: Record<string, string>;
  branch: string;
  app?: string;
  sourceRoot: string;
  root: string;
}

export enum KeysForBuildExecutorProps {
  branch = 'branch',
}
type baseBuildExecutorProps = {
  [KeyName in KeysForBuildExecutorProps]: any;
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PropsForBuildExecutor extends baseBuildExecutorProps {}

// depricated
export enum Executors {
  Build = 'Build',
  Synth = 'Synth',
  Deploy = 'Deploy',
}

export enum Commands {
  synth = 'synth',
  buildEnv = 'buildEnv',
  synthLocal = 'synthLocal',
  deploy = 'deploy',
}
