import { getIDFromURL } from "../../utilities/getInfo";
import { authGuard } from "../../utilities/authGuard";
import { getKey } from "../../api/auth/key"; // Assuming getKey() is the function to retrieve the token

authGuard();

import { API_SOCIAL_POSTS, API_KEY } from "../../api/constants";

const postId = getIDFromURL();

/**
 * Modifies the API endpoint to include the _author=true query parameter.
 * @type {string}
 */
const endpoint = `${API_SOCIAL_POSTS}/${postId}?_author=true`;

/**
 * Retrieves the post data from the API and renders it on the page.
 * @param {string} endpointValue - The API endpoint to fetch the post data from.
 * @returns {Promise<void>}
 */
async function retrievePost(endpointValue) {
  try {
    const token = await getKey(); // Retrieve the Bearer token
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await fetch(endpointValue, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML = ""; // Clear the container before repopulating

    const post = data.data;

    if (post) {
      const avatarUrl = post.author?.avatar?.url || "";

      // Create a new div for the post and build its HTML structure
      const postDiv = document.createElement("div");
      postDiv.classList.add("each-post");
      postDiv.id = `post-${post.id}`;

      let postContent = `
        <div class="avatar-name-container">
          ${
            avatarUrl
              ? `<img src="${avatarUrl}" alt="Avatar" class="post-avatar">`
              : ""
          }
          ${
            post.author
              ? `<p><a href="/profile/?author=${post.author.name}">${post.author.name}</a></p>`
              : ""
          }
        </div>
        ${
          post.media
            ? `
              <a href="/post/?id=${post.id}">
                <img src="${post.media.url}" alt="${
                post.media.alt || "Post image"
              }" class="post-media">
              </a>
            `
            : ""
        }
        <h3 class="post-title">${post.title}</h3>
        <p class="post-body">${post.body}</p>
        <p><strong>Published on:</strong> ${new Date(
          post.created
        ).toLocaleDateString()} ${new Date(
        post.created
      ).toLocaleTimeString()}</p>
      `;

      // Add tags if they exist
      if (post.tags && post.tags.length > 0) {
        postContent += `<p><strong>Tags:</strong> ${post.tags.join(", ")}</p>`;
      }

      postDiv.innerHTML = postContent;

      // Append the post element to the container
      postContainer.appendChild(postDiv);
    } else {
      postContainer.innerHTML = "<p>Post not found.</p>";
    }
  } catch (error) {
    // Handle errors in the fetch operation
  }
}

// Initial load of the post
retrievePost(endpoint);
