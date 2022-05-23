export interface DeployExecutorSchema {
  stackName: string;
  stackNameRegexString?: string;
  gitBranchToCorrespondingStackName: { [key: string]: string };
  selectStackNameBasedOnCurrentGitBranch: boolean;
}
