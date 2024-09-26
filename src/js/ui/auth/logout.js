export function onLogout() {
  window.location.href = "/auth/login/";
  localStorage.clear();
}
