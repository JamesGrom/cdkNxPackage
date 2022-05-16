import {
  Tree,
  convertNxGenerator,
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
    targets: {
      build: {
        executor: `@authillo/cdk:build`,
      },
      synth: {
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'default',
        configurations: {
          default: {
            local: false,
            // stackNameRegexString: `^authillo-[a-z]*$`,
          },
          local: {
            local: true,
          },
        },
        executor: `@authillo/cdk:synth`,
      },
      deploy: {
        // outputs: ['{options.outputPath}'],
        executor: `@authillo/cdk:deploy`,
      },
    },
    tags: normalizedOptions.parsedTags,
  };
  // const localAssetLibrary: ProjectConfiguration = {
  //   root: normalizedOptions.projectRoot,
  //   projectType: 'library',
  //   sourceRoot: `${normalizedOptions.projectRoot}/src`,
  //   targets: {
  //     build: {
  //       executor: `@authillo/cdk:buildenv`,
  //       defaultConfiguration: 'remote',
  //       configurations: {
  //         local: {},
  //         remote: {},
  //       },
  //     },
  //   },
  // };
  addProjectConfiguration(host, normalizedOptions.projectName, project);
  const workspace = readWorkspaceConfiguration(host);

  updateWorkspaceConfiguration(host, workspace);
  addFiles(host, normalizedOptions);

  return runTasksInSerial(...tasks);
}
export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
