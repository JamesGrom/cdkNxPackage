import { logger } from '@nrwl/devkit';
import { exec } from 'child_process';
import { ParsedBuildExecutorArgs } from '../executors/build/executor';
import { BuildExecutorSchema } from '../executors/build/schema';
export const LARGE_BUFFER = 1024 * 1000000;
import {
  Commands,
  Executors,
  PropsForBuildExecutor,
} from '../executors/interfaces';
import { ParsedSynthExecutorArgs } from '../executors/synth/executor';

export function parseArgs(
  whichExecutor: Executors,
  options: BuildExecutorSchema
): Record<string, string> {
  switch (whichExecutor) {
    case Executors.Build: {
      const temp: PropsForBuildExecutor = { branch: '' };
      const validKeys = Object.keys(temp);
      const keys = Object.keys(options);
      return keys
        .filter((prop) => validKeys.indexOf(prop) >= 0)
        .reduce((acc, key) => ((acc[key] = options[key]), acc), {});
    }
    default:
      return {};
  }
}

export function createCommand(
  command: Commands,
  options: ParsedBuildExecutorArgs | ParsedSynthExecutorArgs
) {
  let commandString = `cdk `;
  switch (command) {
    case Commands.synth: {
      const castedOptions = options as ParsedSynthExecutorArgs;
      commandString += 'synth ';
      commandString += `${castedOptions.stackName} `;
      return commandString;
    }
    default: {
      return '';
    }
  }
}
export function runCommandProcess(
  command: string,
  cwd: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    logger.info(`Executing command: ${command}`);
    const childProcess = exec(command, {
      maxBuffer: LARGE_BUFFER,
      env: process.env,
      cwd,
    });
    // Ensure the child process is killed when the parent exits
    const processExitListener = () => childProcess.kill();
    process.on('exit', processExitListener);
    process.on('SIGTERM', processExitListener);

    childProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    childProcess.stderr.on('data', (err) => {
      process.stderr.write(err);
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        resolve(false);
      }

      process.removeListener('exit', processExitListener);
    });
  });
}
