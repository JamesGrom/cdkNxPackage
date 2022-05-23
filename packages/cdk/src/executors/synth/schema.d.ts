export interface SynthExecutorSchema {
  stackName?: string;
  defaultStackName: string;
  local: boolean;
  gitBranchToCorrespondingStackName: { [key: string]: string };
  selectStackNameBasedOnCurrentGitBranch: boolean;
  stackNameRegexString?: string;
}
