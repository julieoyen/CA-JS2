import { API_SOCIAL_PROFILES } from "../constants"; // Import constants for API key and endpoint
import { getMyToken } from "../../utilities/getInfo.js";
import { getNameFromURL } from "../../utilities/getInfo.js"; // Import utility to retrieve username from URL
import { headers } from "../../api/headers"; // Adjust the path according to your folder structure
const token = await getMyToken();
// Create fetch options including method and headers
const createFetchOptions = (requestHeaders, token) => {
  return {
    method: "GET",
    headers: requestHeaders,
    redirect: "follow",
  };
};

// Make a GET request to the provided URL with given options
const makeGetRequest = async (url, fetchOptions) => {
  try {
    const response = await fetch(url, fetchOptions); // Fetch data from API
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`); // Handle response errors
    }
    const result = await response.json(); // Parse response as JSON
    return result.data; // Return the data part of the response
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return null or handle error as needed
    return null;
  }
};

// Fetch the profile data for the currently visited user
export async function readProfile() {
  const username = getNameFromURL(); // Get the username from the URL
  console.log("Retrieved username:", username); // Debug log for username

  const requestHeaders = headers(); // Create request headers
  requestHeaders.append("Authorization", `Bearer ${token}`); // Append token to headers
  const fetchOptions = createFetchOptions(requestHeaders, token); // Create fetch options

  // Constructing the fetch URL using the username
  const fetchUrl = `${API_SOCIAL_PROFILES}/${username}`;
  console.log("Attempting to fetch profile from the site:", fetchUrl); // Debug log for the constructed URL

  const response = await makeGetRequest(fetchUrl, fetchOptions); // Fetch the profile data
  if (!response) {
    console.error("Failed to fetch profile data"); // Handle if the fetch was unsuccessful
    return null; // Return null or handle as appropriate
  }
  console.log("readProfile response:", response); // Log the fetched response
  return response; // Return the profile data
}
