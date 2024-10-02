import { authGuard } from "../../utilities/authGuard"; // Import authentication guard
import { readPostsByUser } from "../../api/post/read"; // Import function to fetch posts by user
import { readProfile } from "../../api/profile/read"; // Import function to fetch user profile
import { deletePost } from "../../api/post/delete"; // Import function to delete a post

import { getMyName, getNameFromURL } from "../../utilities/getInfo.js"; // Import necessary functions

// Render the profile information section
const renderProfilePage = (profileData, isOwner) => {
    const profileSection = document.getElementById("profile-info");
    const username = getMyName();
    profileSection.innerHTML = `
        <h2>${profileData.name}</h2>
        <p>${profileData.bio}</p>
        ${isOwner ? `<p>Welcome back, ${username}</p>` : ""}
    `;
};

// Render the posts section of the profile page
const renderPostsPage = (postsData, isOwner) => {
    const userPostsSection = document.getElementById("user-posts");
    userPostsSection.innerHTML = ""; // Clear previous posts

    const postsHeader = document.createElement("h2");
    postsHeader.textContent = "Posts"; // Header for posts section
    userPostsSection.appendChild(postsHeader);

    postsData.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            ${post.media ? `<img src="${post.media.url}" alt="${post.media.alt}"> <p>${post.media.alt}</p>` : ""}
            <p>${post.body}</p>
            ${post.author ? `<p>Posted by <a href="/profile?username=${post.author.name}">${post.author.name}</a></p>` : ""}
            ${isOwner ? `
                <button class="edit-post-btn" data-post-id="${post.id}">Edit</button>
                <button class="delete-post-btn">Delete</button>
            ` : ""}
        `;
        userPostsSection.appendChild(postElement); // Add post to the posts section

        // Add delete functionality to the delete button
        const deleteButton = postElement.querySelector('.delete-post-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                deletePost(post.id); // Delete the post on button click
            });
        }

        // Add edit functionality to the edit button
        const editButton = postElement.querySelector('.edit-post-btn');
        if (editButton) {
            editButton.addEventListener('click', () => {
                const postId = post.id;
                window.location.href = `/post/edit/?id=${postId}`; // Redirect to edit page
            });
        }
    });
};


// Generate the create post and update profile buttons only if the user is the owner
const renderOwnerButtons = (isOwner) => {
    const actionsSection = document.getElementById("actions-section");

    if (isOwner) {
        // Create and append the "Create Post" button
        const createPostButton = document.createElement("button");
        createPostButton.id = "create-post-btn";
        createPostButton.textContent = "Create Post";
        createPostButton.addEventListener("click", () => {
            window.location.href = "/post/create/";
        });
        actionsSection.appendChild(createPostButton);

        // Create and append the "Update Profile" button
        const updateProfileButton = document.createElement("button");
        updateProfileButton.id = "update-profile-btn";
        updateProfileButton.textContent = "Update Profile";
        updateProfileButton.addEventListener("click", () => {
            window.location.href = "/profile/update";
        });
        actionsSection.appendChild(updateProfileButton);
    }
};


// Handle the profile page logic
const handleProfilePage = async () => {
    try {
        const currentUser = getNameFromURL(); // Get the current user's name from URL
        const loggedInUser = getMyName(); // Get the logged-in user's name
        const isOwner = currentUser === loggedInUser; // Check if the logged-in user is the owner of the profile

        const profileData = await readProfile(); // Fetch profile data
        renderProfilePage(profileData, isOwner); // Render profile data

        const postsData = await readPostsByUser(currentUser); // Fetch posts by user
        renderPostsPage(postsData, isOwner); // Render posts

        renderOwnerButtons(isOwner); // Render buttons for the owner
    } catch (error) {
        console.error("Error handling profile page:", error); // Log any errors
    }
};

// Invoke the profile page handling function
handleProfilePage();
