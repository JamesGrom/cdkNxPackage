import { BuildExecutorSchema } from '../executors/build/schema';

import { Executors, PropsForBuildExecutor } from '../executors/interfaces';

export function parseArgs(
  whichExecutor: Executors,
  options: BuildExecutorSchema
): Record<string, string> {
  switch (whichExecutor) {
    case Executors.Build: {
      const temp: PropsForBuildExecutor = { stacks: [] };
      const validKeys = Object.keys(temp);
      const keys = Object.keys(options);
      return keys
        .filter((prop) => validKeys?.indexOf(prop) >= 0)
        .reduce((acc, key) => ((acc[key] = options[key]), acc), {});
    }
  }
}
