import { authGuard } from "../../utilities/authGuard";
authGuard();

import { API_SOCIAL_POSTS } from "../../api/constants";
let alteredEndpoint = `${API_SOCIAL_POSTS}/following`
let useAltEndpoint = false; // Initialize the toggle variable

function retrievePosts(endpoint)
{fetch(endpoint, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': '43a001bd-a6e7-4ff1-be52-17baec127374',
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
    const postsContainer = document.getElementById('posts-container');
  
    data.data.forEach(post => {
      if (post.title) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
  
        let postContent = 
        `<h2>${post.title}</h2>
         <p>author: ${post.author}`;

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
        postsContainer.appendChild(postDiv);
      }
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
  }

  document.getElementById('toggleButton').addEventListener('click', () => {
    const endpoint = useAltEndpoint ? API_SOCIAL_POSTS : alteredEndpoint;
    useAltEndpoint = !useAltEndpoint;
    document.getElementById('toggleButton').textContent = useAltEndpoint ? 'Fetch from alteredEndpoint' : 'Fetch from API_SOCIAL_POSTS';

    retrievePosts(endpoint)
})
