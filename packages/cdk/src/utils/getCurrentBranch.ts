import { exec } from 'child_process';
import * as util from 'util';
const prom_exec = util.promisify(exec);
export const getCurrentBranch = async (): Promise<string | null> => {
  try {
    const { stdout } = await prom_exec(`git rev-parse --abbrev-ref HEAD`);
    if (typeof stdout !== 'string') {
      throw 'invalid stdout type';
    }
    return stdout?.trim() ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getStackNameForCurrentGitBranch = async (branchToStackNameMap: {
  [key: string]: string;
}): Promise<string | null> => {
  if (branchToStackNameMap == null) return null;
  try {
    const currentBranch = await getCurrentBranch();
    const stackName = branchToStackNameMap[currentBranch] ?? null;
    if (stackName == null)
      throw "couldn't resolve stackName for current branch";
    return stackName;
  } catch (err) {
    console.log(err);
    throw "current git branch doesn't have corresponding stack name assigned";
  }
};
