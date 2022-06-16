import { DummybuildExecutorSchema } from './schema';
import executor from './executor';

const options: DummybuildExecutorSchema = {};

describe('Dummybuild Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});