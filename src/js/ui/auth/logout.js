/**
 * Handles the logout functionality.
 *
 * @returns {void}
 */
export function onLogout() {
  localStorage.removeItem("accessToken");

  window.location.href = "/auth/login/";
}
