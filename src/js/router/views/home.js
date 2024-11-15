import { authGuard } from '../../utilities/authGuard';
import { getMyName, getNameFromURL } from '../../utilities/getInfo.js';
import { getKey } from '../../api/auth/key';
import { API_SOCIAL_POSTS, API_KEY } from '../../api/constants';
import { deletePost } from '../../api/post/delete.js';


// Initial setup
const myName = getMyName();
const myProfileLink = document.getElementById('my-profile-link');
myProfileLink.href = `/profile/?author=${myName}`;
const searchButton = document.getElementById("search-button");
const searchField = document.getElementById("searchbar-field");

// Set up search functionality
let searchQuery = ''; // To store the search query

searchField.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim(); // Get the search query as user types

  if (searchQuery.length > 0) {
    loadPosts(1, searchQuery); // Start from the first page if searching
  } else {
    loadPosts(1); // If no search query, load all posts
  }
});

// Close search bar when clicked outside
if (searchField && searchButton) {
  window.addEventListener("click", (e) => {
    if (!searchField.contains(e.target) && !searchButton.contains(e.target)) {
      searchField.classList.add("hidden");
    }
  });
}
authGuard();

let currentPage = 1;
const postsPerPage = 12; // Number of posts per page
const postsContainer = document.getElementById('posts-container');
const paginationControls = document.getElementById('pagination-controls');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
let totalPosts = 0; // Define totalPosts variable

// Function to calculate "time ago" format
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

// Load posts for the current page or search query
export async function loadPosts(page = 1, query = '') {
  currentPage = page; // Update the current page
  try {
    const token = await getKey();

    if (!token) {
      throw new Error('Token not found');
    }

    let url = `${API_SOCIAL_POSTS}?_author=true&page=${page}&limit=${postsPerPage}`;
    if (query) {
      url = `${API_SOCIAL_POSTS}/search?q=${encodeURIComponent(query)}&page=${page}&limit=${postsPerPage}`;
    }

    // Fetch posts with pagination or search query
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Noroff-API-Key': API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const { data: posts, meta } = await response.json();
    totalPosts = meta.total; // Update totalPosts with the total number of posts
    const totalPages = meta.pageCount; // Get total pages from meta




    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
      const postElement = document.createElement('div');
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
  'mx-auto' );
    
      const avatarUrl = post.author?.avatar?.url || '';
      const isOwner = myName === post.author?.name;
    
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
                ? `
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
  
        <div class="m-2 min-h-40 max-h-40">
          <h3 class="post-title font-bold text-xl text-left m-2 truncate break-words max-w-fit hover:cursor-pointer text-wrap">
            <a href="/post/?id=${post.id}">${post.title}</a>
          </h3>
  
          <p class="post-body text-sm text-left m-2 break-words w-fit hover:cursor-pointer">
            <a href="/post/?id=${post.id}">${post.body}</a>
          </p>
        </div>
  
        <div id="time-tags" class="flex flex-row text-gray-600 pb-4 w-fit mx-2 mt-2justify-between">
          <p class="text-left font-bold text-xs ml-2">Posted: ${timeSincePosted(post.created)}</p>
          ${
            post.tags && post.tags.length > 0 
              ? `<p class="text-right text-xs font-bold ml-2">Tags: ${post.tags.join(', ')}</p>`
              : ''
          }
        </div>
      </div>
    `;
  


    

    
      postsContainer.appendChild(postElement);


      const deleteButton = postElement.querySelector('.delete-btn');
      if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
          const postId = e.target.getAttribute('data-post-id');
          if (postId) {
            deletePost(postId);
          }
      });
    }
    });

    // Render pagination controls
    renderPaginationControls(totalPages);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('Error loading posts:', error);
  }
}




// Function to render pagination controls
function renderPaginationControls(totalPages) {
  // Disable the previous and next buttons if we're at the first or last page
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  // Clear any existing page buttons
  paginationControls.querySelectorAll('.page-btn').forEach(button => button.remove());

  // Limit the number of pages shown in the pagination control (e.g., 5 pages)
  const maxPageButtons = 4;

  // Show only pages around the current page
  let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
  let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

  // Adjust startPage if endPage exceeds totalPages
  if (endPage - startPage < maxPageButtons - 1) {
    startPage = Math.max(endPage - maxPageButtons + 1, 1);
  }

  // Generate page buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-btn', 'pagination-btn', 'lg:py-2', 'lg:px-4', 'md:py-2', 'md:px-4' ,'py-1', 'px-2', 'rounded-md', 'cursor-pointer', 'transition-colors', 'duration-300');
    pageButton.classList.add(i === currentPage ? 'bg-primary' : 'bg-gray-300', 'text-gray-600', i === currentPage ? 'text-white' : 'hover:bg-secondary');
    pageButton.addEventListener('click', () => loadPosts(i)); // Navigate to the clicked page
    paginationControls.insertBefore(pageButton, nextButton);
  }
}

// Add event listeners to previous and next buttons
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    loadPosts(currentPage - 1); // Move to the previous page
  }
});

nextButton.addEventListener('click', () => {
  const totalPages = Math.ceil(totalPosts / postsPerPage); // Recalculate totalPages based on totalPosts
  if (currentPage < totalPages) {
    loadPosts(currentPage + 1); // Move to the next page
  }
});

// Initial load
loadPosts(currentPage);