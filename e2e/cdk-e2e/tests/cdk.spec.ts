import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('cdk e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@authillo/cdk', 'dist/packages/cdk');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });
  const project = uniq('cdk');
  it('should create application', async () => {
    await runNxCommandAsync(
      `generate @authillo/cdk:application --projName=${project}`
    );
  }, 120000);

  describe('--directory', () => {
    it('should create application', async () => {
      expect(() => {
        checkFilesExist(`apps/${project}/src/main.ts`);
      }).not.toThrow();
      expect(() => {
        checkFilesExist(`libs/from${project}/src/index.ts`);
      }).not.toThrow();
    });
  });
  // describe(`--synth`, () => {
  //   it('should run synth', async () => {
  //     const result = await runNxCommandAsync(
  //       `run ${project}:synth --stackName=${project}`
  //     );
  //     expect(result.stdout).toContain(
  //       'Successfully ran target synth for project'
  //     );
  //   }, 120000);
  // });
  describe(`--synth:local`, () => {
    it('should run synth:local', async () => {
      const result = await runNxCommandAsync(
        `run ${project}:synth:local --stackName=${project}`
      );
      expect(result.stdout).toContain(
        'Successfully ran target synth for project'
      );
    }, 120000);
  });

  // describe('--directory', () => {
  //   it('should create src in the specified directory', async () => {
  //     const project = uniq('cdk');
  //     await runNxCommandAsync(
  //       `generate @authillo/cdk:cdk ${project} --directory subdir`
  //     );
  //     expect(() =>
  //       checkFilesExist(`libs/subdir/${project}/src/index.ts`)
  //     ).not.toThrow();
  //   }, 120000);
  // });

  // describe('--tags', () => {
  //   it('should add tags to the project', async () => {
  //     const projectName = uniq('cdk');
  //     ensureNxProject('@authillo/cdk', 'dist/packages/cdk');
  //     await runNxCommandAsync(
  //       `generate @authillo/cdk:cdk ${projectName} --tags e2etag,e2ePackage`
  //     );
  //     const project = readJson(`libs/${projectName}/project.json`);
  //     expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
  //   }, 120000);
  // });
});
