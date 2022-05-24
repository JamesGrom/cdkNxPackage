export interface BuildEnvExecutorSchema {
  cdkOutputsFileName: string;
  pathToCdkOutputs?: string;
  gitBranchToCorrespondingStackName: { [key: string]: string };
  whichBuilderToBuilderFilesMap: { [key: string]: string };
  whichBuilder: string;
}
