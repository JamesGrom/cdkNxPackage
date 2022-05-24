export interface BuildEnvExecutorSchema {
  local: boolean;
  cdkOutputsFileName: string;
  pathToCdkOutputs?: string;
  stackName: string;
  gitBranchToCorrespondingStackName: { [key: string]: string };
  selectStackNameBasedOnCurrentGitBranch: boolean;
  whichBuilderToBuilderFilesMap: { [key: string]: string };
  whichBuilder: string;
}
