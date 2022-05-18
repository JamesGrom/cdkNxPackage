// export interface SynthExecutorSchema {
//   stackName?: string;
//   defaultStackName: string;
//   local: boolean;
//   stackNameRegexString?: string;
// }

export interface ServeExecutorSchema {
  stackName: string;
  logFile: string;
  envFile: string;
}
