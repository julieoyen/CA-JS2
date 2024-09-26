import { createPost } from "../../api/post/create";
/**
 * Handles the creation of a new post when the form is submitted.
 *
 * This function prevents the default form submission behavior, extracts the post
 * data from the form fields, and calls the `createPost` function to send the
 * request to the API.
 *
 * @param {Event} event - The form submission event.
 *
 * @throws {Error} If the API request fails or returns an error.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
export async function onCreatePost(event) {
  event.preventDefault();
  const form = event.target;
  const title = form.title.value;
  const body = form.body.value;
  const tags = form.tags.value;
  const media = form.image.value;

  if (!title || !body) {
    alert("Please enter a title and body for your post.");
    return;
  }

  try {
    await createPost({ title, body, tags, media });
    console.log("Post created successfully!");
  } catch (error) {
    alert("Error creating post: " + error.message);
  }
}
