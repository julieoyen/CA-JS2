export async function getKey() {
  const accessToken = localStorage.getItem("token");
  if (!accessToken) {
    console.error("Unable to find accessToken in localStorage");
    return null;
  }
  return accessToken;
}
