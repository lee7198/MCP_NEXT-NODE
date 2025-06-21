import oracledb from 'oracledb';

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
};

function checkEnv() {
  if (!dbConfig.user || !dbConfig.password || !dbConfig.connectString) {
    throw new Error(
      'ORACLE_USER, ORACLE_PASSWORD, ORACLE_CONNECT_STRING 환경변수가 모두 설정되어야 합니다.'
    );
  }
}

export async function getOracleConnection() {
  try {
    checkEnv();
    // Ensure the Node.js process uses a consistent timezone
    if (!process.env.TZ) {
      process.env.TZ = 'Asia/Seoul';
    }

    const connection = await oracledb.getConnection(dbConfig);
    // Align Oracle session timezone with the Node.js timezone
    await connection.execute("ALTER SESSION SET TIME_ZONE = 'Asia/Seoul'");
    return connection;
  } catch (err) {
    console.error('Oracle 연결 실패:', err);
    throw err;
  }
}
