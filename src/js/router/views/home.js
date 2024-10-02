import { authGuard } from "../../utilities/authGuard";
import { getMyName, getMyToken } from "../../utilities/getInfo.js";
import { API_SOCIAL_POSTS, API_KEY, API_SOCIAL_POSTS_FOLLOWING } from "../../api/constants";
import { deletePost } from "../../api/post/delete.js";



let endpoint = API_SOCIAL_POSTS+"?_author=true";
const myName = getMyName();
const token = getMyToken();
console.log(token)
const myProfileLink = document.getElementById("my-profile-link");
myProfileLink.href = `/profile/?author=${myName}`;


authGuard();

console.log(myName)


// Function to retrieve and display posts from the specified endpoint
function retrievePosts(endpointValue) {
  fetch(endpointValue, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
      'Authorization': `Bearer ${token}`
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
  
        // Create the content for the post
        let postContent = 
        `<h2>${post.title}</h2>
         <p>Author: <a href=/profile/?author=${post.author.name}>${post.author.name}</a></p>`;
  
        if (post.body) {
          postContent += `<p>${post.body}</p>`;
        }
  
        // Append media if it exists
        if (post.media && post.media.url) {
          postContent += `<img src="${post.media.url}" alt="${post.media.alt || 'Post image'}" style="width: 100%; height: auto;">`;
        }
  
        if (post.created) {
          postContent += `<p><strong>Publish date:</strong> ${new Date(post.created).toLocaleDateString()} ${new Date(post.created).toLocaleTimeString()}</p>`;
        }
  
        if (post.tags && post.tags.length > 0) {
          postContent += `<p><strong>Tags:</strong> ${post.tags.join(', ')}</p>`;
        }
  
        // Set the post content
        postDiv.innerHTML = postContent;
  
        if (myName === post.author.name) {
          const deleteButton = document.createElement('button');
          deleteButton.textContent = `delete post ${post.id}`;
          deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the click event from bubbling up to the anchor
            event.preventDefault(); // Prevent the default anchor behavior
            deletePost(post.id); // Call deletePost function
          });
          postDiv.appendChild(deleteButton); // Append the delete button
        }
        

        // Append the content inside the link
        postLink.appendChild(postDiv);
  
        // Append the link to the container
        postsContainer.appendChild(postLink);
      }
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}

retrievePosts(endpoint);

document.getElementById('toggleButton').addEventListener('click', () => {
  endpoint = (endpoint === API_SOCIAL_POSTS) ? API_SOCIAL_POSTS_FOLLOWING : API_SOCIAL_POSTS;

  document.getElementById('toggleButton').innerText = 
    (endpoint === API_SOCIAL_POSTS_FOLLOWING) ? 'Displaying followed posts' : 'Displaying all posts';

});
