import {
  Tree,
  convertNxGenerator,
  formatFiles,
  names,
  getWorkspaceLayout,
  offsetFromRoot,
  generateFiles,
  GeneratorCallback,
  ProjectConfiguration,
  addProjectConfiguration,
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
} from '@nrwl/devkit';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import path = require('path');
import initGenerator from '../init/init';
import { CdkAppOptions } from './schema';

interface NormalizedSchema extends CdkAppOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: CdkAppOptions
): NormalizedSchema {
  const name = names(options.projName ?? 'backend').fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
function genOptionsToTouchLocalSynthFiles(
  host: Tree,
  options: CdkAppOptions
): NormalizedSchema {
  const name = names(options.projName ?? 'backend').fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${
    getWorkspaceLayout(host).appsDir
  }/../dist/apps/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}
function touchLocalSynthFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'touchFile'),
    options.projectRoot,
    templateOptions
  );
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}
function addBackendFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'backendfiles'),
    options.projectRoot,
    templateOptions
  );
}

function addExampleLambdaFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'lambda'),
    options.projectRoot,
    templateOptions
  );
}

export async function applicationGenerator(host: Tree, options: CdkAppOptions) {
  const tasks: GeneratorCallback[] = [];
  const normalizedOptions = normalizeOptions(host, options);
  const initTask = await initGenerator(host, {
    ...options,
  });

  tasks.push(initTask);
  const project: ProjectConfiguration = {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    implicitDependencies: [
      'rootlambda',
      `from${normalizedOptions.projectName}`,
    ],
    targets: {
      run: {
        executor: '@nrwl/node:node',
        options: {
          buildTarget: `${normalizedOptions.projectName}:build`,
          watch: false,
        },
      },
      build: {
        executor: '@nrwl/node:webpack',
        outputs: ['{options.outputPath}'],
        dependsOn: [{ projects: 'dependencies', target: 'build' }],
        options: {
          outputPath: `apps/${normalizedOptions.projectName}/compiled/${normalizedOptions.projectName}`,
          tsConfig: `apps/${normalizedOptions.projectName}/tsconfig.app.json`,
          assets: [],
          main: `apps/${normalizedOptions.projectName}/bin/main.ts`,
          externalDependencies: 'none',
          outputFileName: 'index.js',
        },
        configurations: {
          production: {
            optimization: true,
            extractLicenses: true,
            inspect: false,
            fileReplacements: [],
          },
        },
      },
      synth: {
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'local',
        dependsOn: [{ projects: 'self', target: 'build' }],
        configurations: {
          local: {
            local: true,
            defaultStackName: `${normalizedOptions.projectName}`,
            stackName: `${normalizedOptions.projectName}`,
          },
        },
        executor: `@authillo/cdk:synth`,
      },
      serve: {
        executor: '@authillo/cdk:serve',
        dependsOn: [
          { projects: 'self', target: 'synth' },
          { projects: 'dependencies', target: 'buildenv' },
        ],
        defaultConfiguration: 'default',
        configurations: {
          default: {
            stackName: `${normalizedOptions.projectName}`,
            envFile: `libs/from${normalizedOptions.projectName}/env/env.json`,
            templateFile: `dist/apps/${normalizedOptions.projectName}/local-template.yaml`,
          },
        },
      },
      deploy: {
        outputs: [
          `libs/from${normalizedOptions.projectName}/cdkOutputs/cdk.outputs.json`,
        ],
        executor: `@authillo/cdk:deploy`,
        defaultConfiguration: 'default',
        dependsOn: [{ projects: 'self', target: 'build' }],
        configurations: {
          default: {
            stackName: `${normalizedOptions.projectName}`,
          },
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  };

  addProjectConfiguration(host, normalizedOptions.projectName, project);
  const normalizedBackendOptions = normalizeFromBackendOptions(host, options);
  const frombackend: ProjectConfiguration = {
    root: normalizedBackendOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedBackendOptions.projectRoot}/src`,
    implicitDependencies: [`${normalizedOptions.projectName}`],
    targets: {
      // build: {
      //   executor: '@nrwl/js:tsc',
      //   outputs: ['{options.outputPath}'],
      //   options: {
      //     outputPath: `dist/libs/${normalizedBackendOptions.projectName}`, //'dist/libs/gql-operations',
      //     tsConfig: `libs/${normalizedBackendOptions.projectName}/tsconfig.lib.json`,
      //     packageJson: `libs/${normalizedBackendOptions.projectName}/package.json`,
      //     main: `libs/${normalizedBackendOptions.projectName}/src/index.ts`, // 'libs/gql-operations/src/index.ts',
      //     assets: [`libs/${normalizedBackendOptions.projectName}/*.md`],
      //   },
      // },
      buildfrontendenv: {
        executor: `@authillo/cdk:buildenv`,
        dependsOn: [{ projects: 'dependencies', target: 'deploy' }],
        outputs: [
          `libs/${normalizedBackendOptions.projectName}/env/frontendEnv.json`,
        ],
        defaultConfiguration: `default`,
        options: { stackName: `${normalizedOptions.projectName}` },
        configurations: {
          default: {},
        },
      },
      buildenv: {
        executor: `@authillo/cdk:buildenv`,
        outputs: [`libs/${normalizedBackendOptions.projectName}/env/env.json`],
        dependsOn: [{ projects: 'dependencies', target: 'deploy' }],
        defaultConfiguration: `local`,
        options: { stackName: `${normalizedOptions.projectName}` },
        configurations: {
          local: {
            local: true,
          },
        },
      },
      run: {
        executor: `@nrwl/node:node`,
        options: {
          buildTarget: `${normalizedBackendOptions.projectName}:build`,
        },
        defaultConfiguration: 'default',
        configurations: {
          default: {
            args: ['local'],
          },
          local: {
            args: {
              local: true,
            },
          },
        },
      },
      // build: {
      //   executor: `@authillo/cdk:buildenv`,
      //   defaultConfiguration: 'default',
      //   configurations: {
      //     local: {
      //       local: true,
      //     },
      //     default: {
      //       local: false,
      //     },
      //   },
      // },
    },
  };
  addProjectConfiguration(
    host,
    `${normalizedBackendOptions.projectName}`,
    frombackend
  );
  const normalizedExampleLambdaOptions = normalizeExampleLambdaOptions(
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
          outputPath: `apps/${normalizedOptions.projectName}/compiled/${normalizedExampleLambdaOptions.projectName}`,
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
  addFiles(host, normalizedOptions);
  addBackendFiles(host, normalizedBackendOptions);
  addExampleLambdaFiles(host, normalizedExampleLambdaOptions);
  touchLocalSynthFiles(host, genOptionsToTouchLocalSynthFiles(host, options));
  await formatFiles(host);
  return runTasksInSerial(...tasks);
}
function normalizeFromBackendOptions(
  host: Tree,
  options: CdkAppOptions
): NormalizedSchema {
  const name = names(`from${options.projName ?? 'backend'}`).fileName;
  const projectDirectory = name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function normalizeExampleLambdaOptions(
  host: Tree,
  options: CdkAppOptions
): NormalizedSchema {
  const name = names(`rootlambda`).fileName;
  const projectDirectory = name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
