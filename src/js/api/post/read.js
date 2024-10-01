import { API_KEY } from "../constants";
import { getKey } from "../auth/key";
import { API_SOCIAL_POSTS } from "../constants";
import { createRequestHeaders } from "../profile/read";
import { API_SOCIAL_PROFILES } from "../constants";

async function makeGetRequest(url, requestHeaders) {
  const token = await getKey();
  requestHeaders.append("Authorization", `Bearer ${token}`);

  const fetchOptions = {
    method: "GET",
    headers: requestHeaders,
    redirect: "follow",
  };

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
}

export async function readPost(id) {
  const requestHeaders = createRequestHeaders();
  const token = await getKey();
  requestHeaders.append("Authorization", `Bearer ${token}`);
  return makeGetRequest(`${API_SOCIAL_POSTS}/${id}`, requestHeaders);
}

export async function readPosts(limit = 12, page = 1, tag) {
  const requestHeaders = new Headers();
  requestHeaders.append("X-Noroff-API-Key", API_KEY);

  let url = `${API_SOCIAL_POSTS}?limit=${limit}&page=${page}`;

  if (tag) {
    url += `&tag=${tag}`;
  }

  return makeGetRequest(url, requestHeaders);
}

export async function readPostsByUser(username, limit = 12, page = 1, tag) {
  console.log("readPostsByUser username:", username);
  const requestHeaders = createRequestHeaders();

  // Fetch the user's posts using their username
  let url = `${API_SOCIAL_PROFILES}/${username}/posts?limit=${limit}&page=${page}&_author=true`;

  if (tag) {
    url += `&tag=${tag}`;
  }

  return makeGetRequest(url, requestHeaders);
}
