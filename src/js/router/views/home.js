import { authGuard } from "../../utilities/authGuard";
import { getKey } from "../../api/auth/key";
authGuard();

import {
  API_SOCIAL_POSTS,
  API_KEY,
  API_SOCIAL_POSTS_FOLLOWING,
} from "../../api/constants";

let endpoint = API_SOCIAL_POSTS;

const accessToken = await getKey();

// Function to retrieve and display posts from the specified endpoint
function retrievePosts(endpointValue) {
  fetch(endpointValue, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const postsContainer = document.getElementById("posts-container");
      postsContainer.innerHTML = ""; // Clear the container before repopulating

      // Populate the container with posts
      data.data.forEach((post) => {
        if (post.title) {
          const postDiv = document.createElement("div");
          postDiv.classList.add("post");

          let postContent = `<h2>${post.title}</h2>
         <p>author: ${post.author}</p>`;

          if (post.body) {
            postContent += `<p>${post.body}</p>`;
          }

          if (post.media && post.media.url) {
            postContent += `<img src="${post.media.url}" alt="${
              post.media.alt || "Post image"
            }" style="width: 100%; height: auto;">`;
          }

          if (post.created) {
            postContent += `<p><strong>Publish date:</strong> ${new Date(
              post.created
            ).toLocaleDateString()} ${new Date(
              post.created
            ).toLocaleTimeString()}</p>`;
          }

          if (post.tags && post.tags.length > 0) {
            postContent += `<p><strong>Tags:</strong> ${post.tags.join(
              ", "
            )}</p>`;
          }

          postDiv.innerHTML = postContent;
          postsContainer.appendChild(postDiv);
        }
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

retrievePosts(endpoint);

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
