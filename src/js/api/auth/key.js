export async function getKey(token) {
  const token = localStorage.getItem(token);
  if (!token) {
    console.error(`Token not found`);
    return null;
  }
  return token;
}
