import './css/style.css';
import router from './js/router';
import { setLogoutListener } from './js/ui/global/logout';
import { addFavicon } from './js/utilities/linkFavIcon';

addFavicon();

/**
 * Initializes the application.
 *
 * @returns {void}
 */
await router(window.location.pathname);

// Set up logout functionality
const logoutButton = document.getElementById('logout-btn');
if (logoutButton) {
  setLogoutListener();
}

// Dropdown toggle functionality for user profile menu
const dropdownButton = document.getElementById('user-menu-button'); // Updated to match new ID
const dropdownMenu = document.getElementById('navbar-links'); // Updated to match new ID

if (dropdownButton && dropdownMenu) {
  dropdownButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('hidden');
  });
}

// Close dropdown when clicking outside
window.addEventListener('click', (event) => {
  if (!event.target.closest('#user-menu-button') && !event.target.closest('#navbar-links')) {
    dropdownMenu.classList.add('hidden');
  }
});
