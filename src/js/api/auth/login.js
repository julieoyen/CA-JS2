import { API_AUTH_LOGIN } from "../constants";
import { headers } from "../headers";
export async function login({ email, password }) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: {
        ...headers(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = `Login failed ${response.statusText} (${response.status})`;
      alert(`Error: ${errorText}. Please try again.`);
      throw new Error(errorText);
    }
    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Login error:", error);
    return { error: error.message };
  }
}
