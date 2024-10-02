import { readPostsByUser } from "../../api/post/read";
import { readProfile } from "../../api/profile/read";
import { deletePost } from "../../api/post/delete";
import { showUpdateForm, onUpdateProfile } from "../../ui/profile/update";
import { getMyName, getNameFromURL } from "../../utilities/getInfo";

/**
 * Render the user's profile on the page.
 * @param {Object} profileData - The data of the user's profile.
 * @param {boolean} isOwner - Flag indicating if the current user owns the profile.
 */
const renderProfilePage = (profileData, isOwner) => {
  const profileSection = document.getElementById("profile-info");

  const { bio, banner, avatar, name } = profileData;
  const bannerUrl = banner?.url !== "string" ? banner?.url : null;
  const avatarUrl = avatar?.url !== "string" ? avatar?.url : null;

  profileSection.style.backgroundImage = bannerUrl ? `url(${bannerUrl})` : "";
  profileSection.style.backgroundSize = bannerUrl ? "cover" : "";
  profileSection.style.backgroundPosition = bannerUrl ? "center" : "";

  profileSection.innerHTML = `
    ${isOwner ? `<p>Welcome back</p>` : ""}    
    <h2>${name || "Unknown User"}</h2>
    ${avatarUrl ? `<img src="${avatarUrl}" alt="Avatar" class="avatar">` : ""} 
    ${bio && bio !== "string" ? `<p>${bio}</p>` : ""}
  `;
};

/**
 * Render the user's posts on the profile page.
 * @param {Array} postsData - An array of post data objects.
 * @param {boolean} isOwner - Flag indicating if the current user owns the posts.
 */
const renderPostsPage = (postsData, isOwner) => {
  const userPostsSection = document.getElementById("user-posts");
  userPostsSection.innerHTML = `<h2>Posts</h2>`;

  const fragment = document.createDocumentFragment();

  postsData.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("each-post");
    postElement.id = `post-${post.id}`;

    const avatarUrl = post.author?.avatar?.url || "";
    postElement.innerHTML = `
      <div class="avatar-name-container">
        ${
          avatarUrl
            ? `<img src="${avatarUrl}" alt="Avatar" class="post-avatar">`
            : ""
        }
        ${
          post.author
            ? `<p><a href="/profile/?author=${post.author.name}">${post.author.name}</a></p>`
            : ""
        }
      </div>
      ${
        post.media
          ? `
        <a href="/post/?id=${post.id}">
          <img src="${post.media.url}" alt="${post.media.alt}">
        </a>
      `
          : ""
      }
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      ${
        isOwner
          ? `
        <div class="button-container">
          <button class="post-btn edit-btn" data-post-id="${post.id}">Edit</button>
          <button class="post-btn delete-btn" data-post-id="${post.id}">Delete</button>
        </div>
      `
          : ""
      }
    `;

    fragment.appendChild(postElement);
  });

  userPostsSection.appendChild(fragment);

  // Handle event delegation for edit/delete buttons
  userPostsSection.addEventListener("click", (event) => {
    const target = event.target;
    const postId = target.getAttribute("data-post-id");

    if (target.classList.contains("delete-btn")) {
      deletePost(postId);
    }

    if (target.classList.contains("edit-btn")) {
      window.location.href = `/post/edit/${postId}`;
    }
  });
};

/**
 * Attach event listeners to the update form actions (show form, submit form).
 */
const attachProfileEventListeners = () => {
  const showUpdateButton = document.getElementById("show-update-form");
  const profileUpdateForm = document.getElementById("profile-update-form");

  if (showUpdateButton) {
    showUpdateButton.addEventListener("click", showUpdateForm);
  }

  if (profileUpdateForm) {
    profileUpdateForm.addEventListener("submit", onUpdateProfile);
  }
};

/**
 * Render the buttons for the profile owner (Create Post, Update Profile).
 * @param {boolean} isOwner - Flag indicating if the current user owns the profile.
 */
const renderOwnerButtons = (isOwner) => {
  if (!isOwner) return;

  const actionsSection = document.getElementById("actions-section");
  actionsSection.innerHTML = `
    <button id="create-post-btn">Create Post</button>
    <button id="update-profile-btn">Update Profile</button>
  `;

  document.getElementById("create-post-btn").addEventListener("click", () => {
    window.location.href = "/post/create/";
  });

  document
    .getElementById("update-profile-btn")
    .addEventListener("click", showUpdateForm);

  attachProfileEventListeners();
};

/**
 * Handle the profile page logic, including fetching profile and posts, and rendering the UI.
 */
const handleProfilePage = async () => {
  try {
    const currentUser = getNameFromURL();
    const loggedInUser = getMyName();
    const isOwner = currentUser === loggedInUser;

    const [profileData, postsData] = await Promise.all([
      readProfile(currentUser),
      readPostsByUser(currentUser),
    ]);

    renderProfilePage(profileData, isOwner);
    renderPostsPage(postsData, isOwner);
    renderOwnerButtons(isOwner);
  } catch (error) {
    console.error("Error handling profile page:", error);
  }
};

// Initialize the profile page
handleProfilePage();
