import * as bcrypt from 'bcrypt';
const roundsOfHashing = 10;
export async function hashPassword(value: string) {
  const hashed = await bcrypt.hash(value, roundsOfHashing);
  return hashed;
}

export function verifyHased(params: { value: string; hashed: string }) {
  return bcrypt.compare(params.value, params.hashed);
}
