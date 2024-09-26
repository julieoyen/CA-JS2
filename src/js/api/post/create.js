// js/api/post/create.js
import { API_SOCIAL_POSTS } from "../constants";
import { headers } from "../headers";
import { getKey } from "../auth/key";

/**
 * Sends a request to create a new post on the API.
 *
 * This function sends a POST request to the server,
 * including the post details (title, body, tags, media, and altMedia) in a JSON
 * payload, along with necessary headers for authorization and API key.
 *
 * @async
 * @param {Object} postData - The post data object.
 * @param {string} postData.title - The title of the post.
 * @param {string} postData.body - The body/content of the post.
 * @param {string[]} postData.tags - An array of tags associated with the post.
 * @param {string} postData.media - The URL of the media (image) associated with the post and alt text.
 *
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function createPost({ title, body, tags, media, altMedia }) {
  console.log("createPost function called!");
  console.log("API endpoint:", API_SOCIAL_POSTS);

  const apiUrl = API_SOCIAL_POSTS;
  const accessToken = await getKey();
  const apiKeyHeader = headers();

  const postHeaders = createHeaders(accessToken, apiKeyHeader);
  const postData = createPostData({ title, body, tags, media, altMedia });

  console.log("Post data:", postData);

  try {
    console.log("About to send request to API...");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: postHeaders,
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Response data:", responseData);
      window.alert("Post created successfully!");
      window.location.href = "/";
    } else {
      throw new Error(`Error creating post: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

function createHeaders(accessToken, apiKeyHeader) {
  const postHeaders = new Headers();
  postHeaders.append("Content-Type", "application/json");
  postHeaders.append("Authorization", `Bearer ${accessToken}`);
  const [apiKey, apiValue] = apiKeyHeader.entries().next().value;
  postHeaders.append(apiKey, apiValue);
  return postHeaders;
}

function createPostData({ title, body, tags, media }) {
  const postData = {
    title,
    body,
    tags: tags ? [tags] : [],
  };

  if (media) {
    postData.media = {
      url: media,
      alt: altMedia || "Image alt text",
    };
  }

  return postData;
}
