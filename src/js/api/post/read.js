import { API_KEY } from "../constants";
import { API_SOCIAL_POSTS, API_SOCIAL_PROFILES } from "../constants";
import { headers } from "../../api/headers";
import { getMyToken } from "../../utilities/getInfo.js"; // Import the function to get the token

const token = getMyToken(); // Retrieve the token directly

async function makeGetRequest(url, requestHeaders) {

    if (token) {
        requestHeaders.append("Authorization", `Bearer ${token}`); // Append token to headers
    }

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
        return null; // Return null for error handling
    }
}


export async function readPost(id) {
  const requestHeaders = headers();
  requestHeaders.append("Authorization", `Bearer ${token}`);
  return makeGetRequest(`${API_SOCIAL_POSTS}/${id}`, requestHeaders);
}

export async function readPosts(limit = 12, page = 1, tag) {
  const requestHeaders = new Headers();
  requestHeaders.append("X-Noroff-API-Key", API_KEY);
  return makeGetRequest(API_SOCIAL_POSTS, requestHeaders);
}

export async function readPostsByUser(username, limit = 12, page = 1, tag) {
  console.log("readPostsByUser username:", username);
  const requestHeaders = headers();

  // Fetch the user's posts using their username
  let url = `${API_SOCIAL_PROFILES}/${username}/posts?limit=${limit}&page=${page}&_author=true`;

  if (tag) {
    url += `&tag=${tag}`;
  }

  return makeGetRequest(url, requestHeaders);
}
