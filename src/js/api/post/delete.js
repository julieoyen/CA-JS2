import { API_SOCIAL_POSTS, API_KEY } from "../../api/constants";
import { getMyName, getMyToken } from "../../utilities/getInfo.js";
export async function deletePost(id) {
    const token = getMyToken()
    const confirmed = confirm("Are you sure you want to delete this post?");
    
    if (!confirmed) {
      return;
    }
  
    fetch(`${API_SOCIAL_POSTS}/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'X-Noroff-API-Key': API_KEY,
        'Authorization': `Bearer ${token}`}
    })
    .then(response => {
      if (response.status === 204) {
        alert("Post deleted"); 
        return; 
      }
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    })
    .then(data => {
      location.reload(); // Refresh the page
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  }
  