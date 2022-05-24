export interface SynthExecutorSchema {
  local: boolean;
  gitBranchToCorrespondingStackName: { [key: string]: string };
  stackNameRegexString?: string;
}
