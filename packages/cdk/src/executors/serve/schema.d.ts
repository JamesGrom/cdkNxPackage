export interface ServeExecutorSchema {
  logFile?: string;
  envFile?: string;
  templateFile?: string;
  warmContainers?: warmContainers;
  gitBranchToCorrespondingStackName: { [key: string]: string };
}
export type warmContainers = 'LAZY' | 'EAGER';
