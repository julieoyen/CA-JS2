import { authGuard } from "../../utilities/authGuard";
import { getMyName } from "../../utilities/getInfo.js";
import { getKey } from "../../api/auth/key";
import {
  API_SOCIAL_POSTS,
  API_KEY,
  API_SOCIAL_POSTS_FOLLOWING,
} from "../../api/constants";
import { deletePost } from "../../api/post/delete.js";

let endpoint = API_SOCIAL_POSTS + "?_author=true";
const myName = getMyName();
const myProfileLink = document.getElementById("my-profile-link");
myProfileLink.href = `/profile/?author=${myName}`;

authGuard();

/**
 * Retrieves posts from the API and displays them in the #posts-container.
 * @async
 * @param {string} endpointValue - The API endpoint to fetch posts from.
 * @returns {Promise<void>}
 */
async function retrievePosts(endpointValue) {
  try {
    const token = await getKey();

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
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = "";

    data.data.forEach((post) => {
      if (post.title) {
        const postElement = document.createElement("div");
        postElement.classList.add("each-post");

        const avatarUrl = post.author?.avatar?.url || "";
        const isOwner = myName === post.author.name;

        postElement.innerHTML = `
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
              <img src="${post.media.url}" alt="${post.media.alt}" class="post-media">
            </a>`
              : ""
          }
          <h3 class="post-title">${post.title}</h3>
          <p class="post-body">${post.body}</p>
          <p><strong>Published on:</strong> ${new Date(
            post.created
          ).toLocaleDateString()} ${new Date(
          post.created
        ).toLocaleTimeString()}</p>
          ${
            post.tags && post.tags.length > 0
              ? `<p><strong>Tags:</strong> ${post.tags.join(", ")}</p>`
              : ""
          }
          ${
            isOwner
              ? `
            <div class="button-container">
              <button class="post-btn edit-btn" data-post-id="${post.id}">Edit</button>
              <button class="post-btn delete-btn" data-post-id="${post.id}">Delete</button>
            </div>`
              : ""
          }
        `;

        postsContainer.appendChild(postElement);

        const deleteButton = postElement.querySelector(".delete-btn");
        if (deleteButton) {
          deleteButton.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            deletePost(post.id);
          });
        }

        const editButton = postElement.querySelector(".edit-btn");
        if (editButton) {
          editButton.addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = `/post/edit/${post.id}`;
          });
        }
      }
    });
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

retrievePosts(endpoint);

/**
 * Toggles between displaying all posts and followed posts.
 */
document.getElementById("toggleButton").addEventListener("click", () => {
  endpoint =
    endpoint === API_SOCIAL_POSTS
      ? API_SOCIAL_POSTS_FOLLOWING
      : API_SOCIAL_POSTS;

  document.getElementById("toggleButton").innerText =
    endpoint === API_SOCIAL_POSTS_FOLLOWING
      ? "Displaying followed posts"
      : "Displaying all posts";

  retrievePosts(endpoint);
});
