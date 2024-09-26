import "./css/style.css";
import router from "./js/router";
import { setLogoutListener } from "./js/ui/global/logout";

await router(window.location.pathname);

if (document.querySelector("#logout-button") !== null) {
  setLogoutListener();
}
