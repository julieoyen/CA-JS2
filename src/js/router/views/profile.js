import { authGuard } from "../../utilities/authGuard";
import { readPostsByUser } from "../../api/post/read";
import { readProfile } from "../../api/profile/read";

const renderProfilePage = (profileData) => {
  const profileSection = document.getElementById("profile-info");
  profileSection.innerHTML = `
      <h2>${profileData.name}</h2>
      <p>${profileData.bio}</p>
    `;
};

const renderPostsPage = (postsData, isOwner) => {
  const userPostsSection = document.getElementById("user-posts");
  const postsList = postsData.map((post) => {
    const postElement = document.createElement("div");
    const postHTML = `
        <h3>${post.title}</h3>
        ${
          post.media
            ? `
        <img src="${post.media.url}" alt="${post.media.alt}">
          <p>${post.media.alt}</p>
        `
            : ""
        }
        <p>${post.body}</p>
        ${
          post.author
            ? `
          <p>Posted by <a href="/profile?username=${post.author.name}">${post.author.name}</a></p>
        `
            : ""
        }
        ${
          isOwner
            ? `
          <button class="edit-post-btn" data-post-id="${post.id}">Edit</button>
          <button class="delete-post-btn">Delete</button>
        `
            : ""
        }
      `;
    postElement.innerHTML = postHTML;
    return postElement;
  });
  userPostsSection.innerHTML = "";
  const postsHeader = document.createElement("h2");
  postsHeader.textContent = "Posts";
  userPostsSection.appendChild(postsHeader);
  postsList.forEach((postElement) => userPostsSection.appendChild(postElement));

  const editButtons = document.querySelectorAll(".edit-post-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const postId = event.target.getAttribute("data-post-id");
      window.location.href = `/post/edit/${postId}`;
    });
  });
};

const renderCreatePostButton = (isLoggedIn, isOwner) => {
  const createPostButton = document.getElementById("create-post-btn");
  if (createPostButton) {
    if (isLoggedIn && isOwner) {
      createPostButton.style.display = "block";
      createPostButton.addEventListener("click", () => {
        window.location.href = "/post/create/";
      });
    } else {
      createPostButton.style.display = "none";
    }
  } else {
    console.error("Create post button not found");
  }
};

const getLoggedInUserID = () => {
  const storedValue = localStorage.getItem("userID");
  if (storedValue.includes(",")) {
    return storedValue.split(",")[1].trim();
  } else {
    return storedValue;
  }
};
const handleProfilePage = async () => {
  authGuard();
  try {
    const loggedInUserID = getLoggedInUserID();

    const profileData = await readProfile(loggedInUserID);
    renderProfilePage(profileData);

    const postsData = await readPostsByUser(loggedInUserID);
    console.log("postsData:", postsData);
    renderPostsPage(postsData, true);
    renderCreatePostButton(true, true);
  } catch (error) {
    console.error("Error handling profile page:", error);
  }
};

handleProfilePage();
