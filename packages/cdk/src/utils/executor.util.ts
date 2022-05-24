import { logger } from '@nrwl/devkit';
import { exec } from 'child_process';
import { ParsedBuildEnvExecutorArgs } from '../executors/buildenv/executor';
import { ParsedDeployExecutorArgs } from '../executors/deploy/executor';
export const LARGE_BUFFER = 1024 * 1000000;
import { Commands } from '../executors/interfaces';
import { ParsedServeExecutorArgs } from '../executors/serve/executor';
import {
  ParsedSynthExecutorArgs,
  ParsedSynthLocalExecutorArgs,
} from '../executors/synth/executor';

export function createCommand(
  command: Commands,
  options:
    | ParsedBuildEnvExecutorArgs
    | ParsedSynthExecutorArgs
    | ParsedSynthLocalExecutorArgs
    | ParsedServeExecutorArgs
) {
  let commandString = `cdk `;
  switch (command) {
    case Commands.synth: {
      const castedOptions = options as ParsedSynthExecutorArgs;
      commandString += 'synth ';
      commandString += `${castedOptions.stackName} `;
      return commandString;
    }
    case Commands.synthLocal: {
      const castedOptions = options as ParsedSynthLocalExecutorArgs;
      commandString += `synth ${castedOptions.stackName} > ${castedOptions.offsetFromRoot}dist/apps/${castedOptions.projectName}/local-template.yaml`;
      return commandString;
    }
    case Commands.buildEnv: {
      const castedOptions = options as ParsedBuildEnvExecutorArgs;
      commandString = `ts-node builders/${castedOptions.builderFileName} cdkOutputs/${castedOptions.fileName} ${castedOptions.stackName} `;
      return commandString;
    }
    case Commands.serve: {
      const castedOptions = options as ParsedServeExecutorArgs;
      commandString = `sam local start-api -t ${castedOptions.offsetFromRoot}${castedOptions.templateFile} -l ${castedOptions.logFile} -n ${castedOptions.offsetFromRoot}${castedOptions.envFile}`;
      return commandString;
    }
    case Commands.deploy: {
      const castedOptions = options as ParsedDeployExecutorArgs;
      commandString += `deploy ${castedOptions.stackName} --require-approval=never -O ${castedOptions.offsetFromRoot}libs/from${castedOptions.projectName}/cdkOutputs/cdk.outputs.json`;
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
  return new Promise((resolve) => {
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
