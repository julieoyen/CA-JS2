import { authGuard } from "../../utilities/authGuard";
import { getKey } from "../../api/auth/key";
import { getMyName } from "../../utilities/getInfo";
import { API_SOCIAL_POSTS, API_KEY, API_SOCIAL_POSTS_FOLLOWING } from "../../api/constants";

authGuard();

const myProfileLink = document.getElementById("my-profile-link");
const myName = getMyName();
const accessToken = await getKey();
let endpoint = API_SOCIAL_POSTS+"?_author=true";

myProfileLink.href = `/profile/?author=${myName}`; // Replace with your desired URL

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
 
  .then(data => {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = ''; // Clear the container before repopulating

    // Populate the container with posts
    data.data.forEach(post => {
      if (post.title) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        // Create a clickable anchor element
        const postLink = document.createElement('a');
        // Change the href to include the post ID as part of the path, not as a query parameter
        postLink.href = `/post/?id=${post.id}`;

        postLink.style.textDecoration = 'none'; // Remove underline for styling, optional
        postLink.style.color = 'inherit'; // Maintain default text color, optional

        let postContent = 
        `<h2>${post.title}</h2>
         <p>Author: <a href=/profile/?author=${post.author.name}>${post.author.name}</a></p>`;


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

        // Append the content inside the link
        postLink.appendChild(postDiv);

        // Append the link to the container
        postsContainer.appendChild(postLink);
      }

    });
}

retrievePosts(endpoint);

document.getElementById('toggleButton').addEventListener('click', () => {
  endpoint = (endpoint === API_SOCIAL_POSTS) ? API_SOCIAL_POSTS_FOLLOWING : API_SOCIAL_POSTS;

  document.getElementById('toggleButton').innerText = 
    (endpoint === API_SOCIAL_POSTS_FOLLOWING) ? 'Displaying followed posts' : 'Displaying all posts';

  retrievePosts(endpoint);
});
