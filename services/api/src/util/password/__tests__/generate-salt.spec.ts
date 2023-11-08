import {makeGenerateSalt} from '../generate-salt';

describe('Generate Salt Unit Tests', () => {
  it('When make generate salt Then defined function', async () => {
    const generateSalt = makeGenerateSalt();

    expect(generateSalt).toBeDefined();
    expect(generateSalt).toBeInstanceOf(Function);
  });
});
