export interface BuildEnvExecutorSchema {
  local: boolean;
  cdkOutputsFileName: string;
  pathToCdkOutputs?: string;
  stackName: string;
}
