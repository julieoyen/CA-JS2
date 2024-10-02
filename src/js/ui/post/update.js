import { API_SOCIAL_POSTS, API_KEY } from "../../api/constants";
import { headers } from "../../api/headers";
import { getIDFromURL, getMyToken } from "../../utilities/getInfo";



const targetId = getIDFromURL();
const endpoint = API_SOCIAL_POSTS + "/" + targetId;
console.log(endpoint);

// Function to fetch post data from the API and populate the form
export async function onUpdatePost(postId) {
  const token = getMyToken(); // Retrieve the Bearer token

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,      // Set the Bearer token
        'X-Noroff-API-Key': API_KEY,             // Set the API key
        ...headers(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch post data');
    }

    const postData = await response.json();
    populateForm(postData.data); // Accessing the 'data' property in the response
  } catch (error) {
    console.error('Error fetching post data:', error);
  }
}

// Function to populate the form with the post data
function populateForm(post) {
  document.getElementById('title').value = post.title;
  document.getElementById('body').value = post.body;
  document.getElementById('tags').value = post.tags.join(', ');
  document.getElementById('image').value = post.media?.url || ''; // Assuming 'media.url' is the image URL
  document.getElementById('imageAlt').value = post.media?.alt || ''; // Assuming 'media.alt' is the alt text
}



// Call this when the page loads to fetch and display the post data
export async function fetchPostData() {
  const postId = getIDFromURL(); // Define how you're getting the post ID
  await onUpdatePost(postId); // Call the update function to fetch and populate the form
}

// Example of how you could call fetchPostData on page load
fetchPostData();
