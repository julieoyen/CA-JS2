import { getIDFromURL } from "../../utilities/getInfo";
import { API_SOCIAL_POSTS, API_KEY } from "../../api/constants";
import { getMyToken } from "../../utilities/getInfo";
import { headers } from "../../api/headers";
const postId = getIDFromURL();
const token = getMyToken()

// Function to handle form submission and send updated data to the API
export async function submitEditForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior
  
// Retrieve the Bearer token
  
    const updatedPostData = {
      title: document.getElementById('title').value,
      body: document.getElementById('body').value,
      tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
      media: {
        url: document.getElementById('image').value,
        alt: document.getElementById('imageAlt').value,
      },
    };
  
    try {
      const response = await fetch(`${API_SOCIAL_POSTS}/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,     // Set the Bearer token
          'X-Noroff-API-Key': API_KEY,            // Ensure correct API key header
          'Content-Type': 'application/json',
          ...headers(),
        },
        body: JSON.stringify(updatedPostData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
  
      const updatedPost = await response.json();
      console.log('Post updated successfully:', updatedPost);
      // Optionally, redirect or give feedback to the user
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }