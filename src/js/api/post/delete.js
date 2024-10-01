import { API_SOCIAL_POSTS } from "../../api/constants";

export async function deletePost(id) {
    fetch(`${API_SOCIAL_POSTS}/${id}`, {
        method: "DELETE",
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
      .then(data =>{
        alert(`Post deleted ${data}`)
      }
    
      )
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
}
