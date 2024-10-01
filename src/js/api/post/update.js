import { API_SOCIAL_POSTS } from "../constants";
import { headers } from "../headers";
import { getKey } from "../auth/key";

export async function updatePost(id, { title, body, tags, media }) {
  console.log("updatePost function called");
  const apiUrl = `${API_SOCIAL_POSTS}/${id}`;
  const accessToken = await getKey();
  const apiKeyHeader = headers();

  const patchHeaders = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  const [apiKey, apiValue] = apiKeyHeader.entries().next().value;
  patchHeaders.append(apiKey, apiValue);

  const updatedPostData = {
    title,
    body,
    tags: tags.length ? tags : [], // Ensure tags is always an array
  };

  if (media) {
    updatedPostData.media = {
      url: media,
      alt: altMedia || "Image alt text", // Consider allowing user to edit this
    };
  }

  console.log("Updated post data:", updatedPostData);

  try {
    console.log("About to send request to API...");
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: patchHeaders,
      body: JSON.stringify(updatedPostData),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Post updated successfully!", responseData);
    } else {
      throw new Error(`Error updating post: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}
