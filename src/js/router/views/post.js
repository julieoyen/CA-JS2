import { getIDFromURL, getNameFromURL, getMyName } from '../../utilities/getInfo';
import { authGuard } from '../../utilities/authGuard';
import { getKey } from '../../api/auth/key';
import { API_SOCIAL_POSTS, API_KEY } from '../../api/constants';

authGuard();

const postId = getIDFromURL();
const endpoint = `${API_SOCIAL_POSTS}/${postId}?_author=true`;

async function retrievePost(endpointValue) {
  try {
    const token = await getKey();
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(endpointValue, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Noroff-API-Key': API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    const postsData = data.data;

    if (!postsData) {
      throw new Error('No posts data found');
    }


    const loggedInUser  = getMyName();
    const isOwner = token  === loggedInUser ;

    const renderNavbar = (postsData, loggedInUser) => {
      const profileSection = document.getElementById("profile-info")
      const nav = document.querySelector("nav");
      const profilePicture = document.getElementById("user-avatar");
      const username = getMyName() || "Guest";
      const avatarUrl = postsData.author?.avatar?.url || null;
      const bio =
      postsData.bio && postsData.bio !== "string" ? postsData.bio : null;
    const bannerUrl =
      postsData.banner?.url && postsData.banner.url !== "string"
        ? postsData.banner.url
        : null;
    
      if (avatarUrl && profilePicture) {
        profilePicture.src = avatarUrl; // Set the src to the avatarUrl
      } else {
        profilePicture.src = "/public/images/default-avatar.jpg"; // Set to a default avatar if no avatarUrl
      }     if (avatarUrl && profilePicture) {
        profilePicture.src = avatarUrl; // Set the src to the avatarUrl
      } else {
        profilePicture.src = "/public/images/default-avatar.jpg"; // Set to a default avatar if no avatarUrl
      }

      profileSection.innerHTML = ` 
  <div class="flex flex-col items-center justify-center">
  <div class="relative z-10 text-white text-center lg:p-8" pt-7>
    <h1 class="text-lg md:text-3xl sm:text-1xl lg:text-4xl font-bold ">${postsData.author.name || "Unknown User"}</h1>
    <div>
    ${bio ? `<p class="text-lg lg:text-2xl w-full">${bio}</p>` : ""}
    </div>
  `;
    };
    

    renderNavbar(postsData, isOwner);
    timeSincePosted()
    

    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = ''; // Clear previous content

    // Create a post element for the retrieved data
    const postDiv = document.createElement('div');
    postDiv.classList.add(      
      'each-post', 
      'rounded-xl', 
      'shadow-lg', 
      'flex-col', 
      'bg-white', 
      'my-8', 
      
      'max-w-xs',        // Optional: ensures post doesn't get too wide on larger screens
      'pt-4', 
      'flex', 
      'items-center', 
      'mx-auto', 
      'justify-center' );
    postDiv.id = `post-${postsData.id}`;

    const avatarUrl = postsData.author?.avatar?.url || '';
    let postContent = `
    <div class="rounded-lg bg-w-full mx-auto bg-white flex flex-col">
    <div class="flex flex-row justify-between items-center w-full mx-auto">
      <div class="flex flex-row ml-2">
        ${
          avatarUrl 
            ? `<a class="pb-3 hover:cursor-pointer" href="/profile/?author=${postsData.author.name}">
                  <img class="h-12 w-12 object-cover rounded-full" src="${avatarUrl}" alt="Avatar">
                </a>`
            : `<a class="pb-3 hover:cursor-pointer" href="/post/?id=${postsData.id}">
                  <img class="h-12 w-12 object-cover rounded-full" src="/public/images/avatar-icon-profile-icon-member-login-isolated-vector.jpg" alt="Default Avatar">
                </a>`
        }
        ${
          postsData.author 
            ? `<p class="pl-2 pt-3 hover:cursor-pointer">
                <a href="/profile/?author=${postsData.author.name}">${postsData.author.name}</a>
               </p>`
            : ''
        }
      </div>

    </div>
        ${
          postsData.media && postsData.media.url 
            ? `<a href="/post/?id=${postsData.id}" class="flex justify-center hover:cursor-pointer">
                  <img src="${postsData.media.url}" alt="${postsData.media.alt || 'Default Media'}" class="post-media object-cover w-fit h-fit">
               </a>`
            : `<div class="flex justify-center w-full">
                  <img src="/public/images/default-image.avif" alt="Default Media" class="h-64 w-full object-cover">
               </div>`
        }
        <div class="m-2 min-h-40 max-h-40 text-wrap">
        <h3 class="post-title font-bold text-wrap text-xl text-left m-2 truncate w-fit hover:cursor-pointer">
          <a href="/post/?id=${postsData.id}">${postsData.title}</a>
        </h3>

        <p class="post-body text-sm text-left m-2 break-words w-fit hover:cursor-pointer">
          <a href="/post/?id=${postsData.id}">${postsData.body}</a>
        </p>
      </div>
        <div id="time-tags" class="flex flex-row text-gray-600 pb-4 w-fit mx-2 mt-2 justify-between">
          <p class="text-left font-bold text-xs ml-2">Posted: ${timeSincePosted(postsData.created)}</p>
          ${
            postsData.tags && postsData.tags.length > 0 
              ? `<p class="text-right text-xs font-bold ml-2">Tags: ${postsData.tags.join(', ')}</p>`
              : ''
          }
        </div>
      </div>
    `;

    postDiv.innerHTML = postContent;
    postContainer.appendChild(postDiv);
  } catch (error) {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = `<p>Error loading post: ${error.message}</p>`;
  }
}

// Call the function to retrieve the pos

/**
 * Calls the retrievePost function to fetch and display the post data.
 */
retrievePost(endpoint);

function timeSincePosted(postedDate) {
  const now = new Date();
  const diff = now - new Date(postedDate);
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



