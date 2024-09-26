import { login } from "../../api/auth/login";

export async function onLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const email = formData.get("email");
  const password = formData.get("password");

  const result = await login({ email, password });
  if (result.error) {
    alert(result.error);
  } else {
    localStorage.setItem("token", result.data.accessToken);
    localStorage.setItem("userID", result.data.name);
    window.location.href = "/";
  }
}
