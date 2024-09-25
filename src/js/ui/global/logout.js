import { onLogout } from "../auth/logout";

export function setLogoutListener() {
  const logoutButton = document.getElementById("logout-btn");
  logoutButton.addEventListener("click", onLogout);
}
