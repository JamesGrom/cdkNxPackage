export interface DeployExecutorSchema {
  stackNameRegexString?: string;
  gitBranchToCorrespondingStackName: { [key: string]: string };
}
