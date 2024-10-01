import { updatePost } from "../../api/post/update";
import { API_SOCIAL_POSTS } from "../../api/constants";

/**
 * Handles the update post form submission event.
 *
 * @async
 * @param {Event} event - The update post form submission event.
 * @returns {void}
 */
export async function onUpdatePost(event) {
  if (event) {
    event.preventDefault();
  }

  const form = document.forms.editPost;
  const url = new URL(window.location.href);
  const postId = url.searchParams.get("id");
  console.log("postId: ", postId);

  if (!postId) {
    console.error("Post ID is missing");
    return;
  }

  // Retrieve the original post data
  try {
    const response = await fetch(`${API_SOCIAL_POSTS}/${postId}`);
    const originalData = await response.json();

    // Populate the form fields with the original post data
    const titleInput = form.title;
    const bodyInput = form.body;
    const tagsInput = form.tags;
    const imageInput = form.image;

    titleInput.value = originalData.title;
    bodyInput.value = originalData.body;
    tagsInput.value = originalData.tags ? originalData.tags.join(", ") : "";
    imageInput.value = originalData.image;

    if (event) {
      // If this is a form submission event, proceed with the update
      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();
      const tags = tagsInput.value.trim();
      const image = imageInput.value.trim();

      if (!title || !body) {
        alert("Please enter a title and body for your post.");
        return;
      }

      try {
        await updatePost(postId, {
          title,
          body,
          tags,
          media: image,
        });
        alert("Post updated successfully!");
        window.location.href = `/post/${postId}`; // Redirect to the updated post
      } catch (error) {
        alert("Error updating post: " + error.message);
      }
    }
  } catch (error) {
    console.error("Error retrieving original post data:", error);
    alert("Failed to load post data.");
  }
}

// Call onUpdatePost when the page loads to populate the form
onUpdatePost();
