import { getOracleConnection } from '../app/lib/db/connection';

jest.mock('oracledb', () => ({}), { virtual: true });

describe('getOracleConnection', () => {
  const originalEnv = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
  };

  beforeAll(() => {
    delete process.env.ORACLE_USER;
    delete process.env.ORACLE_PASSWORD;
    delete process.env.ORACLE_CONNECT_STRING;
  });

  afterAll(() => {
    if (originalEnv.user) process.env.ORACLE_USER = originalEnv.user;
    if (originalEnv.password) process.env.ORACLE_PASSWORD = originalEnv.password;
    if (originalEnv.connectString) process.env.ORACLE_CONNECT_STRING = originalEnv.connectString;
  });

  it('throws error when env vars are missing', async () => {
    await expect(getOracleConnection()).rejects.toThrow(
      'ORACLE_USER, ORACLE_PASSWORD, ORACLE_CONNECT_STRING 환경변수가 모두 설정되어야 합니다.'
    );
  });
});
