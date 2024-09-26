// ui/post/create.js
import { createPost } from "../../api/post/create";

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
