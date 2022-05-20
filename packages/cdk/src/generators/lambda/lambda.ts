import {
  Tree,
  formatFiles,
  names,
  getWorkspaceLayout,
  offsetFromRoot,
  generateFiles,
  ProjectConfiguration,
  addProjectConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
// import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import path = require('path');
import { LambdaFunctionOptions } from './schema';
interface NormalizedSchema extends LambdaFunctionOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  host: Tree,
  options: LambdaFunctionOptions
): NormalizedSchema {
  const name = names(options.functionName).fileName;
  const projectDirectory = name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}
function getLambdaInterfaceTemplateOptions(
  host: Tree,
  options: LambdaFunctionOptions
): NormalizedSchema {
  const name = names('apiinterfaces').fileName;
  const projectDirectory = name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${
    getWorkspaceLayout(host).libsDir
  }/${projectDirectory}/src/lib/endpoints`;
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}
function uppercase(val: string) {
  return val.toUpperCase();
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  switch (options.functionType) {
    case 'restEndpoint': {
      generateFiles(
        host,
        path.join(__dirname, 'restEndpoint'),
        options.projectRoot,
        { ...templateOptions, uppercase }
      );
      break;
    }
    default: {
      throw 'invalid function type specified';
    }
  }
}
function addLambdaInterfaceFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  switch (options.functionType) {
    case 'restEndpoint': {
      generateFiles(
        host,
        path.join(__dirname, 'functionInterface'),
        options.projectRoot,
        { ...templateOptions, uppercase }
      );
      break;
    }
    default: {
      throw 'invalid function type specified';
    }
  }
}

export async function lambdaGenerator(
  host: Tree,
  options: LambdaFunctionOptions
) {
  const normalizedExampleLambdaOptions = normalizeOptions(host, options);
  const lambdaInterfaceTemplateOptions = getLambdaInterfaceTemplateOptions(
    host,
    options
  );
  const exampleLambda: ProjectConfiguration = {
    root: normalizedExampleLambdaOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedExampleLambdaOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nrwl/node:webpack',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: `apps/${normalizedExampleLambdaOptions.backendProjectName}/compiled/${normalizedExampleLambdaOptions.projectName}`,
          main: `apps/${normalizedExampleLambdaOptions.projectName}/src/main.ts`,
          tsConfig: `apps/${normalizedExampleLambdaOptions.projectName}/tsconfig.app.json`,
          externalDependencies: 'none',
          outputFileName: 'index.js',
        },
      },
    },
  };
  addProjectConfiguration(
    host,
    `${normalizedExampleLambdaOptions.projectName}`,
    exampleLambda
  );
  const workspace = readWorkspaceConfiguration(host);
  updateWorkspaceConfiguration(host, workspace);
  addFiles(host, normalizedExampleLambdaOptions);
  addLambdaInterfaceFiles(host, lambdaInterfaceTemplateOptions);
  await formatFiles(host);
}

export default lambdaGenerator;
