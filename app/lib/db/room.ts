import type { Connection } from 'oracledb';

export const generateRoomId = (length = 7) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    id += chars[array[i] % chars.length];
  }
  return id;
};

export async function createUniqueRoomId(
  connection: Connection,
  userId: string
) {
  let newRoomId = '';
  let isDuplicate = true;
  while (isDuplicate) {
    newRoomId = generateRoomId();
    const checkSql = `SELECT COUNT(*) as count FROM chat_messages WHERE user_id = :userId AND room_id = :roomId`;
    const checkResult = await connection.execute(
      checkSql,
      { userId, roomId: newRoomId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if (checkResult.rows && checkResult.rows[0].COUNT === 0) {
      isDuplicate = false;
    }
  }
  return newRoomId;
}
