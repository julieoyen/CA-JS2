import { getMyName, getNameFromURL } from "../../utilities/getInfo";
import { readPostsByUser } from "../../api/post/read";
import { readProfile } from "../../api/profile/read";
import { updateProfile } from "../../api/profile/update";
import { deletePost } from "../../api/post/delete";

/**
 * Render the user's profile on the page.
 * @param {Object} profileData - The data of the user's profile.
 * @param {boolean} isOwner - Flag indicating if the current user owns the profile.
 */

export function timeSincePosted(postedDate) {
  const now = new Date();
  const diff = now - new Date(postedDate); // Difference in milliseconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return new Date(postedDate).toLocaleDateString();
  } else if (days >= 1) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes >= 1) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export const renderProfilePage = (profileData, isOwner) => {
  const profileSection = document.getElementById("profile-info");
  const nav = document.querySelector("nav")
  const profilePicture = document.getElementById("user-avatar")
  const username = getMyName() || "Guest";

  const bio =
    profileData.bio && profileData.bio !== "string" ? profileData.bio : null;
  const bannerUrl =
    profileData.banner?.url && profileData.banner.url !== "string"
      ? profileData.banner.url
      : null;
  const avatarUrl =
    profileData.avatar?.url && profileData.avatar.url !== "string"
      ? profileData.avatar.url
      : null;

  if (avatarUrl && profilePicture) {
        profilePicture.src = avatarUrl; 
      } else if (profilePicture) {
        profilePicture.src = "/public/images/default-avatar.jpg";
      }
  if (bannerUrl) {
    nav.style.backgroundImage = ` url(${bannerUrl})`;
    nav.style.backgroundSize = "cover";
    nav.style.backgroundRepeat = "no-repeat";
    nav.style.backgroundPosition = "center";
    nav.style.maxHeight = "96px"
  } 
  else {
    profileSection.style.backgroundColor = "#765cd7";
  }

  profileSection.innerHTML = ` 
  <div class="flex flex-col items-center justify-center">
  <div class="relative z-10 text-white text-center lg:p-8" pt-7>
    <h1 class="text-xl lg:text-4xl font-bold ">${profileData.name || "Unknown User"}</h1>
    <div>
    ${bio ? `<p class="text-lg lg:text-2xl w-full">${bio}</p>` : ""}
    </div>
  `;
};

/**
 * Render the user's posts on the page.
 * @param {Array} postsData - An array of post data objects.
 * @param {boolean} isOwner - Flag indicating if the current user owns the posts.
 */
export const renderPostsPage = (postsData, isOwner) => {
  const userPostsSection = document.getElementById("user-posts");
  
  userPostsSection.innerHTML = "";


  postsData.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add(
      'each-post', 
      'rounded-xl', 
      'shadow-lg', 
      'w-full', 
      'max-w-xs', 
      'flex-col', 
      'bg-white', 
      'mb-8', 
      'pt-4', 
      'flex', 
      'items-center',
      'mx-auto' 
    );
  
    const avatarUrl = post.author?.avatar?.url || "";
  
    postElement.innerHTML = `
      <div class="rounded-lg w-full mx-auto bg-white flex flex-col">
        <div class="flex flex-row justify-between items-center w-full mx-auto">
          <div class="flex flex-row ml-2">
            ${
              avatarUrl 
                ? `<a class="pb-3 hover:cursor-pointer" href="/profile/?author=${post.author.name}">
                      <img class="h-12 w-12 object-cover rounded-full" src="${avatarUrl}" alt="Avatar">
                    </a>`
                : `<a class="pb-3 hover:cursor-pointer" href="/post/?id=${post.id}">
                      <img class="h-12 w-12 object-cover rounded-full" src="/public/images/avatar-icon-profile-icon-member-login-isolated-vector.jpg" alt="Default Avatar">
                    </a>`
            }
            ${
              post.author 
                ? `<p class="pl-2 pt-3 hover:cursor-pointer">
                    <a href="/profile/?author=${post.author.name}">${post.author.name}</a>
                   </p>`
                : ''
            }
          </div>
          <div class="mr-2">
            ${
              isOwner 
                ? `<div class="button-container flex justify-center gap-2 mb-2">
                    <button class="post-btn edit-btn cursor-default px-3 py-1 bg-background text-white rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-purple-500" data-post-id="${post.id}">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="post-btn delete-btn hover:cursor-pointer px-3 py-1 bg-red-400 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500" data-post-id="${post.id}">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>`
                : ''
            }
          </div>
        </div>
  
        ${
          post.media && post.media.url 
            ? `<a href="/post/?id=${post.id}" class="flex justify-center hover:cursor-pointer w-full">
                  <img src="${post.media.url}" alt="${post.media.alt || 'Default Media'}" class="post-media object-cover w-full h-64">
               </a>`
            : `<div class="flex justify-center w-full">
                  <img src="/public/images/default-image.avif" alt="Default Media" class="h-64 w-full object-cover">
               </div>`
        }
  
        <div class="m-2 min-h-40 max-h-40 text-wrap">
          <h3 class="post-title font-bold text-wrap text-xl text-left m-2 truncate w-fit hover:cursor-pointer">
            <a href="/post/?id=${post.id}">${post.title}</a>
          </h3>
  
          <p class="post-body text-sm text-left m-2 break-words w-fit hover:cursor-pointer">
            <a href="/post/?id=${post.id}">${post.body}</a>
          </p>
        </div>
  
        <div id="time-tags" class="flex flex-row text-gray-600 pb-4 w-fit mx-2 mt-2 justify-between">
          <p class="text-left font-bold text-xs ml-2">Posted: ${timeSincePosted(post.created)}</p>
          ${
            post.tags && post.tags.length > 0 
              ? `<p class="text-right text-xs font-bold ml-2">Tags: ${post.tags.join(', ')}</p>`
              : ''
          }
        </div>
      </div>
    `;
  
  
    userPostsSection.appendChild(postElement);
  });
  


  userPostsSection.addEventListener("click", (event) => {
    const target = event.target;
    const postId = target.getAttribute("data-post-id");

    if (target.classList.contains("delete-btn")) {
      deletePost(postId);
    }

    if (target.classList.contains("edit-btn")) {
      window.location.href = `/post/edit/?id=${postId}`;
    }
  });
};

/**
 * Toggle the visibility of the profile update form and pre-fill it with the current profile data.
 * @param {Object} profileData - The data of the user's profile.
 */
const showUpdateForm = (profileData) => {
  const updateForm = document.getElementById("update-profile-form");

  if (updateForm.style.display === "block") {
    updateForm.style.display = "none";
  } else {
    document.getElementById("avatar-url").value = profileData.avatar?.url || "";
    document.getElementById("banner-url").value = profileData.banner?.url || "";
    document.getElementById("bio").value = profileData.bio || "";

    updateForm.style.display = "block";
    updateForm.classList.add('bg-secondary', 'p-6', 'rounded-xl', 'shadow-lg', 'max-w-sm', 'mt-10');
  }

  const cancelBtn = document.getElementById("cancel-update-btn");
  cancelBtn.addEventListener("click", () => {
    updateForm.style.display = "none";
  });
};

/**
 * Handle the profile update form submission, update the profile on the server, and reload the page.
 * @param {Event} event - The form submission event.
 */
const handleProfileUpdate = async (event) => {
  event.preventDefault();

  const bio = document.getElementById("bio").value;
  const avatar = document.getElementById("avatar-url").value;
  const banner = document.getElementById("banner-url").value;

  try {
    await updateProfile(bio, { avatar, banner });
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      location.reload();
    }, 500);
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

/**
 * Render the buttons for the profile owner (Create Post and Update Profile).
 * @param {boolean} isOwner - Flag indicating if the current user owns the profile.
 * @param {Object} profileData - The data of the user's profile.
 */
const renderOwnerButtons = (isOwner, profileData) => {
  const authUserLinks = document.getElementById("auth-user-links")


  if (isOwner) {
    const updateProfileButton = document.createElement("button");
    const createPostButton = document.createElement("button")
    createPostButton.id = "create-post-btn";
    createPostButton.classList.add('text-gray-800');
    createPostButton.innerHTML = `  
    <li
    role="option"
    aria-label="Create Post"
    id="create-btn"
    class="cursor-pointer flex items-center p-3 hover:bg-gray-100"
  ><i class="fa-regular fa-square-plus"><a href="/post/create/" id="create-btn" class="ml-2 text-gray-800">
  </i>Create Post</a>
  </li> `;
    updateProfileButton.id = "update-profile-btn";
    updateProfileButton.classList.add('text-gray-800');
    updateProfileButton.innerHTML = `
    <li
    role="option"
    aria-label="update-profile"
    id="actions-section"
    class="cursor-pointer flex items-center p-3 hover:bg-gray-100"
  ><p><i class="fa-solid fa-user-pen"></i> Update Profile<p></li>`;
    updateProfileButton.addEventListener("click", () => {
      showUpdateForm(profileData);
    });
    authUserLinks.appendChild(updateProfileButton);
    authUserLinks.appendChild(createPostButton)


    document
      .getElementById("profile-update-form")
      .addEventListener("submit", handleProfileUpdate);
  }
};

/**
 * Handle the profile page logic, including fetching profile and posts, and rendering the UI.
 */
export const handleProfilePage = async () => {
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
    renderOwnerButtons(isOwner, profileData);
  }
   catch (error) {
    console.error("Error handling profile page:", error);
  }
};

handleProfilePage();
