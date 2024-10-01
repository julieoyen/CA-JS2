import { API_KEY } from "../constants";
import { getKey } from "../auth/key";
import { API_SOCIAL_PROFILES } from "../constants";

export function createRequestHeaders() {
  const requestHeaders = new Headers();
  requestHeaders.append("X-Noroff-API-Key", API_KEY);
  return requestHeaders;
}

const createFetchOptions = (requestHeaders, token) => {
  return {
    method: "GET",
    headers: requestHeaders,
    redirect: "follow",
  };
};

const makeGetRequest = async (url, fetchOptions) => {
  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export async function readProfile(username) {
  const requestHeaders = createRequestHeaders();
  const token = await getKey();
  requestHeaders.append("Authorization", `Bearer ${token}`);
  const fetchOptions = createFetchOptions(requestHeaders, token);
  const response = await makeGetRequest(
    `${API_SOCIAL_PROFILES}/${username}`,
    fetchOptions
  );
  console.log("readProfile response:", response);
  if (!response) {
    throw new Error("Failed to fetch profile data");
  }
  return response;
}
export async function readProfiles(limit, page) {
  const requestHeaders = createRequestHeaders();
  const token = await getKey();
  requestHeaders.append("Authorization", `Bearer ${token}`);
  const fetchOptions = createFetchOptions(requestHeaders, token);
  return makeGetRequest(
    `${API_SOCIAL_PROFILES}?limit=${limit}&page=${page}&author=true`,
    fetchOptions
  );
}
