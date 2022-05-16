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
  //   parsedTags: string[];
}

function normalizeOptions(
  host: Tree,
  options: CdkAppOptions
): NormalizedSchema {
  const name = names(options.projName ?? 'backend').fileName;
  const projectDirectory = name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).libsDir}/${projectDirectory}`;
  //   const parsedTags = options.tags
  //     ? options.tags.split(',').map((s) => s.trim())
  //     : [];
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    // parsedTags,
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
  const normalizedOptions = normalizeOptions(host, options);
  const project: ProjectConfiguration = {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: `@authillo/cdk:buildenv`,
        defaultConfiguration: 'default',
        configurations: {
          local: {
            local: true,
          },
          default: {
            local: false,
          },
        },
      },
    },
  };
  addProjectConfiguration(
    host,
    `from${normalizedOptions.projectName}`,
    project
  );
  const workspace = readWorkspaceConfiguration(host);
  updateWorkspaceConfiguration(host, workspace);
  addFiles(host, normalizedOptions);
}
export default applicationGenerator;
export const applicationSchematic = convertNxGenerator(applicationGenerator);
