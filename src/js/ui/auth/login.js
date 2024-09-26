import { login } from "../../api/auth/login";

export async function onLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await login({ email, password });
  } catch (error) {
    console.error("Login error:", error);
  }
}
