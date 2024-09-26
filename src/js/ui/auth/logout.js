export function onLogout() {
  localStorage.removeItem("accessToken");

  window.location.href = "/auth/login/";
}
