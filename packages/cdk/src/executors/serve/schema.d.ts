export interface ServeExecutorSchema {
  logFile?: string;
  envFile?: string;
  templateFile?: string;
  gitBranchToCorrespondingStackName: { [key: string]: string };
}
