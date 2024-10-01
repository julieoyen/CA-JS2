
function getPostIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('postID');
}

import { authGuard } from "../../utilities/authGuard";
authGuard();

import { API_SOCIAL_POSTS, API_KEY } from "../../api/constants";

// Get the ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id'); // Assuming the URL is something like /post.html?id=123
const endpoint = `${API_SOCIAL_POSTS}/${postId}`;

// Function to retrieve and display a single post from the specified endpoint
function retrievePost(endpointValue) {
  fetch(endpointValue, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWtzZWxfb2xkZWlkZSIsImVtYWlsIjoiYWtzaGVsODc3MDdAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MjcxMjYxNjh9.kTNufOOgrial4IJ1MjYPrtdj2ecCzzYRcuyE-vRVnkk'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = ''; // Clear the container before repopulating

    // Check if the post exists
    const post = data.data;
    if (post) {
      const postDiv = document.createElement('div');
      postDiv.classList.add('post');

      // Build post content
      let postContent = `
        <h2>${post.title}</h2>
        <p>Author: ${post.author}</p>
      `;

      if (post.body) {
        postContent += `<p>${post.body}</p>`;
      }

      if (post.media && post.media.url) {
        postContent += `<img src="${post.media.url}" alt="${post.media.alt || 'Post image'}" style="width: 100%; height: auto;">`;
      }

      if (post.created) {
        postContent += `<p><strong>Publish date:</strong> ${new Date(post.created).toLocaleDateString()} ${new Date(post.created).toLocaleTimeString()}</p>`;
      }

      if (post.tags && post.tags.length > 0) {
        postContent += `<p><strong>Tags:</strong> ${post.tags.join(', ')}</p>`;
      }

      postDiv.innerHTML = postContent;

      // Append the content to the container without wrapping it in a link
      postContainer.appendChild(postDiv);
    } else {
      postContainer.innerHTML = '<p>Post not found.</p>'; // Handle post not found case
    }
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

// Initial load of the post
retrievePost(endpoint);
