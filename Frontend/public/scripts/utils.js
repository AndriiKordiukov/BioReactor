export function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

// SERVER SETTINGS - ADDRESS, PORT, CORS
// export const server = "http://localhost:8080/";
export const server = "http://192.168.1.25:8080/";
export const host = "http://192.168.1.25:5500/";
// API METHODS
export const create = "create"; // POST request
export const byName = "byName/"; // GET request
export const byId = "byId/"; // GET request
export const byNutrint = "byNutrient/"; // GET request
export const byFood = "byFood/"; // GET request
export const byNutrientId = "byNutrientId/"; // GET request
export const users = "users/"; // GET request
export const get = "GET"; // GET request
export const post = "POST"; // POST request
export const patch = "PATCH"; // PATCH request
export const delets = "DELETE"; // DELETE request
// API ENDPOINTS
export const search = "search/"; // GET request
export const vitamins = "vitamins/";
export const minerals = "minerals/";
export const aminoacids = "aminoacids/";
export const food = "food/";
export const relations = "foodNutrientRelations/";
export const interactions = "interactions/";
export const forms = "activeForms/";

export const token = localStorage.getItem("token");

export const nutrient = {
  id: 4, // initial ID number of the nutrient
  name: "",
  fullName: "",
  foodNutrientRelations: [],
  interactions: [],
  rda: "",
  image: "",
  nutrientType: "",
};
export const nutrientsArray = [nutrient];
// Creating Nutrient's Active forms
export const activeForm = {
  id: 0,
  formName: "",
  description: "",
  nutrientId: nutrient.id,
};
export const activeForms = [activeForm];

// Creating Food Sources
export const foodSource = {
  id: 0,
  foodName: "",
  description: "",
  image: "",
};
export const foodSources = [foodSource];

// Creating Food-Nutrient relationship
export const foodNutrientRelation = {
  id: 0,
  amount: "",
  description: "",
  food: 0,
  forms: 0,
  nutrient: 0,
};
export const foodNutrientRelations = [foodNutrientRelation];

// Creating Nutrients Interactions
export const nutrientsInteraction = {
  id: 0,
  firstNutrient: 0,
  secondNutrient: 0,
  interaction: "",
};
export const nutrientsInteractions = [nutrientsInteraction];

/**
 * Sends a dynamic API request and returns a response.
 *
 * @param {string} url - The URL of the API request.
 * @param {string} [method='GET'] - HTTP request method (GET, POST, PUT, DELETE, etc.).
 * @param {object} [data=null] - The data to be sent in the request body.
 * @param {string} [token=null] - JWT token for authentication.
 * @param {object} [headers={}] - Additional headers for the request.
 * @returns {Promise<object>} - API response in JSON format.
 */
export async function fetchAPI(
  url = "",
  method = "GET",
  data = null,
  token = null,
  headers = {}
) {
  const options = {
    // request options
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  if (data) {
    // If data not null -> JSON
    options.body = JSON.stringify(data);
    console.log(options.body);
  }
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(server + url, options); // APIM REQUEST
    if (!response.ok) {
      throw new Error(`API request failed with status code ${response.status}`);
    }
    return await response.json(); // return API response in JSON format
  } catch (error) {
    throw error;
  }
}

// ======== HEADER GENERATING ==========
// Create the header HTML
export const headerHTML = `
<header>
       <div class="header-container">
           <div class="header-left">
               <img src="/icons/bioreactor-logo.png" alt="Logo" class="logo" link="/">
               <a id="bioreactor-logo" href="/">BioReactor</a>
           </div>
           <div class="header-center">
               <nav>
                   <ul class="nav-links">
                       <li class="dropdown">
                           <button class="dropbtn">Nutrients</button>
                           <div class="dropdown-content">
                               <a href="/vitamins">Vitamins</a>
                               <a href="/minerals">Minerals</a>
                               <a href="/aminoacids">Aminoacids</a>
                           </div>
                       </li>
                       <li><a href="/food">Food</a></li>
                       <li><a href="/discover">Discover</a></li>
                   </ul>
               </nav>
           </div>
           <div class="header-right">
               <div class="search-container">
                   <button class="search-btn">
                       <img src="/icons/svg/search.svg" alt="Search">
                   </button>
                   <input type="text" class="search-input" placeholder="Search...">
               </div>
               <div class="search-results"></div>
               <div class="account-icon">
                <img src="/icons/svg/user.svg" alt="user">
               </div>
           </div>
       </div>
       <div class="overlay-search"></div>
   </header>
 `;

export async function headerSearchActivation() {
  const searchBtn = document.querySelector(".search-btn");
  const searchContainer = document.querySelector(".search-container");
  const searchInput = document.querySelector(".search-input");
  const overlay = document.querySelector(".overlay-search");
  const searchResults = document.querySelector(".search-results");
  let searchTimeout;

  function handleDocumentClick(event) {
    if (!searchContainer.contains(event.target)) {
      searchContainer.classList.remove("active");
      overlay.classList.remove("active");
      overlay.classList.remove("active-search");
      searchResults.classList.remove("active");
      document.removeEventListener("click", handleDocumentClick);
    }
  }

  function displayResults(parsedResults) {
    searchResults.innerHTML = ""; // cleaning previous results
    parsedResults.forEach((result) => {
      const item = document.createElement("div");
      item.classList.add("search-result-item");
      console.log(`${result.type}${result.title}`);
      item.innerHTML = `
            <a href="${host}${result.type}${result.title}">${result.title}</a>
            <div class="search-result-description">${result.description}</div>
        `; // target="_blank" inside href to open in new tab
      searchResults.appendChild(item);
    });
    searchResults.classList.add("active"); // show results
    overlay.classList.add("active-search");
  }

  searchBtn.addEventListener("click", function (event) {
    searchContainer.classList.toggle("active");
    overlay.classList.toggle(
      "active",
      searchContainer.classList.contains("active")
    );

    if (searchContainer.classList.contains("active")) {
      document.addEventListener("click", handleDocumentClick);
    }
    event.stopPropagation();
  });

  searchInput.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  searchInput.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      clearTimeout(searchTimeout);
      fetchAndDisplayResults;
    }
  });

  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout); // reset timeout
    // setting up a new timeout for the search
    if (searchInput.value.length > 1) {
      searchTimeout = setTimeout(() => {
        fetchAndDisplayResults();
      }, 1000); // 1 sec
    }
  });

  async function fetchAndDisplayResults() {
    const query = searchInput.value.trim();
    if (query) {
      try {
        const data = await fetchAPI(search + "match/" + query);
        const results = parseSearchResults(data);
        displayResults(results);
      } catch (error) {
        console.error("Error processing search results:", error);
      }
    } else {
      searchResults.innerHTML = ""; // cleaning previous results
      // searchResults.classList.remove('active'); // close, if no results
    }
  }

  overlay.addEventListener("click", function () {
    searchContainer.classList.remove("active");
    overlay.classList.remove("active");
    overlay.classList.remove("active-search");
    searchResults.classList.remove("active");
    document.removeEventListener("click", handleDocumentClick);
  });
}

function parseSearchResults(data) {
  const results = [];
  // Vitamins parsing
  if (data.vitaminsFound && Array.isArray(data.vitaminsFound)) {
    data.vitaminsFound.forEach((vitamin) => {
      results.push({
        type: vitamins,
        title: vitamin.name,
        description: vitamin.shortDescription || "No description available",
      });
    });
  }
  // Minerals parsing
  if (data.mineralsFound && Array.isArray(data.mineralsFound)) {
    data.mineralsFound.forEach((mineralFound) => {
      results.push({
        type: minerals,
        title: mineralFound.name,
        description:
          mineralFound.shortDescription || "No description available",
      });
    });
  }
  // Food parsing
  if (data.foodFound && Array.isArray(data.foodFound)) {
    data.foodFound.forEach((eachFoodFound) => {
      results.push({
        type: food,
        title: eachFoodFound.foodName,
        description: eachFoodFound.description || "No description available",
      });
    });
  }
  // Active Forms parsing
  if (data.activeFormsFound && Array.isArray(data.activeFormsFound)) {
    data.activeFormsFound.forEach((activeFormFound) => {
      results.push({
        type: forms,
        title: activeFormFound.formName,
        description: activeFormFound.description || "No description available",
      });
    });
  }
  return results; // RETURN PARSED RESULTS
}

export const swiperHTML = `
    <div class="swiper mySwiper">
      <div class="swiper-wrapper">
       
      </div>

      <div class="swiper-pagination"></div>
    </div>
    <div class="swiper-button-next swiper-navBtn"></div>
    <div class="swiper-button-prev swiper-navBtn"></div>
`;
export const url = window.location.pathname; // getting curent url
export const nutrientName = url.split("/").pop(); // Extract nutrient's identifier from the URL

export const footerHTML = `
  <div class="footer-content">
    <div class="footer-section">
      <h3 class="footer-section-title">Navigation<i class="fas fa-chevron-down"></i></h3>
      <ul class="footer-section-content">
        <li><a href="/">Main</a></li>
        <li><a href="/vitamins">Vitamins</a></li>
        <li><a href="/minerals">Minerals</a></li>
        <li><a href="/food">Food</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h3 class="footer-section-title">Socials<i class="fas fa-chevron-down"></i></h3>
      <ul class="footer-section-content">
        <li><a href="#">Facebook</a></li>
        <li><a href="#">Instagram</a></li>
        <li><a href="#">X</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <a href="/about">
        <h3 id="footer-link" class="footer-section-title">About</h3>
      </a>
      <h3 class="footer-section-title">Contact Us<i class="fas fa-chevron-down"></i></h3>
      <ul class="footer-section-content">
      <p>bioreactor@gmail.com</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>BioReactor &copy; 2024 All you want to know about Nutrients. All rights reserved.</p>
  </div>
`;

//SERVICE CONSTATNS
const bodyWrapper = document.querySelector(".body-wrapper");
// HEADER
export function LoadHeader() {
  bodyWrapper.insertAdjacentHTML("afterbegin", headerHTML); //Insert Header HTML
  headerSearchActivation();
}
// FOOTER
export async function LoadFooter() {
  const footerWrapper = document.querySelector(".footer");
  await footerWrapper.insertAdjacentHTML("beforeend", footerHTML); //Insert Header HTML

  const footerSectionTitles = document.querySelectorAll(
    ".footer-section-title"
  );
  footerSectionTitles.forEach((title) => {
    title.addEventListener("click", () => {
      title.classList.toggle("active");
      const content = title.nextElementSibling;
      content.classList.toggle("active");
    });
  });
}

// EDIT BUTTON
export async function loadEditLink(nutrientId) {
  if(token){
  let lastElement = document.querySelector("main");
  lastElement.insertAdjacentHTML(
    "beforeEnd",
    `<a href="edit/${nutrientId}" class="edit-link">
            <button id="edit-button">Edit</button></a>`
    );
  }
}

export function checkNutrientType(nutrientName = "") {
  if (nutrientName.toLowerCase().includes("vitamin")) return "/vitamins";
  // if (nutrientName.toLowerCase().includes("mineral")) return '/minerals';
  // if (nutrientName.toLowerCase().includes("aminoacid")) return '/aminoacids';
  return "/minerals";
}

export function loadFavicon() {
  // Create new element link
  const faviconLink = document.createElement("link");
  // Setting it up
  faviconLink.rel = "icon";
  faviconLink.type = "image/x-icon";
  faviconLink.href = "./icons/favicon.png";
  // Put into head section
  document.head.appendChild(faviconLink);
}

export async function deleteRow(row, deleteType = '', objectId) {
  const modal = document.createElement("div");
  modal.classList.add("modal-delete");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-delete-content");

  const message = document.createElement("p");
  message.textContent = "Do you really want to delete a line?";

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const yesButton = document.createElement("button");
  yesButton.classList.add("yes-button");
  yesButton.textContent = "Yes";
  yesButton.addEventListener("click", async () => {
    // ============ Custom function to delete a row ===========
    let rowIndex = findRowIndex(row);
    console.log('Deleting Object with id - ' + objectId);
    await deleteFunction(deleteType, objectId);
    row.remove();
    modal.remove();
  });
  const noButton = document.createElement("button");
  noButton.classList.add("no-button");
  noButton.textContent = "No";
  noButton.addEventListener("click", () => {


    modal.remove();
  });

  buttons.appendChild(yesButton);
  buttons.appendChild(noButton);

  modalContent.appendChild(message);
  modalContent.appendChild(buttons);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
}

// DELETE
async function deleteFunction(deleteType='', deleteId) {
  // DELETING ACTIVE FORM FROM THE DATABASE
  console.log(deleteType + 'delete/' + deleteId);
  
    let result = await fetchAPI(deleteType + 'delete/' + deleteId, delets);
    console.log('Active F with ID -'+ result.id + ' was deleted successfully.');
}




function findRowIndex(row) { 
  let rows = row.parentNode.parentNode.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  let rowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i] === row) {
      rowIndex = i;
      break;
    }
  }
  console.log(`Row index: ${rowIndex + 1}`);
  return rowIndex;
}
// LOGOUT

export function userLogout() {
  localStorage.removeItem("token");
  console.log("User logged out");
  setTimeout(function () {
    toggleAccountPopup();
  }, 500);
}

// LOGIN
// Login function
export async function loginRequest() {
  const loginForm = document.getElementById("login-form");
  const loginLabel = document.getElementById("login-label");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(
      "http://192.168.1.25:8080/users/authenticate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      showStatusMessage(loginLabel, "green", "Login successful!");
    } else {
      showStatusMessage(
        loginLabel,
        "red",
        "Username or password is incorrect! Please try again"
      );
    }
  });
}

export async function registerRequest() {

  const registerForm = document.getElementById("register-form");
  const registerLabel = document.getElementById("register-label");

  registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const response = await fetch("http://localhost:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        showStatusMessage(registerLabel, "green", "Registration successful!");
      } else {
        showStatusMessage(registerLabel, "red", "Registration failed!");
      }
    });
}

function showStatusMessage(container, color, message) {
  let statusMessage = container.querySelector(".status-message");

  if (!statusMessage) {
    console.log("No status message to display - Creating...");
    statusMessage = document.createElement("div");
    statusMessage.classList.add("status-message");
    container.appendChild(statusMessage);
  }

  statusMessage.style.color = color;
  statusMessage.textContent = message;
}

// GET CURRENT USERNAME

async function getCurrentUsername() {
  try {
    let response = await fetch("http://localhost:8080/users/get-username", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      // ERROR
      throw new Error("Network response was not ok");
    }
    const username = await response.text();
    console.log("Username:", username);
    return username;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}

// =================== USER BUTTON HEADER ==========================

export async function userButtonHeader() {
  document
    .querySelector(".account-icon")
    .addEventListener("click", toggleAccountPopup);
  var username;

  if (token) {
    try {
      username = await getCurrentUsername();
    } catch (error) {
      console.error("Error in fetchUsername:", error);
    }

    const userPopup = `
      <div class="account-popup">
        <div class="account-popup-content">
          <div class="user-icon">
            <img src="/icons/svg/isUser.svg" alt="User Icon">
          </div>
          <span class="account-name">Logged as ${username}</span>
          <button id="logout-btn">Logout</button>
        </div>
      </div>
    `;
    try {
      document.body.insertAdjacentHTML("beforeend", userPopup);
      // ASYCNHRONES!!!!
      // document.getElementById("logout-button").addEventListener("click", userLogout);
      const logoutButton = document.getElementById("logout-btn");
      logoutButton.addEventListener("click", userLogout);
    } catch (error) {
      console.error("Error inserting user popup:", error);
    }
  } else {
    console.log("You are not logged in");
    const noUserPopup = `
      <div class="account-popup">
        <div class="account-popup-content">
          <div class="user-icon">
            <img src="/icons/svg/user-no.svg" alt="No User">
          </div>
          <span class="account-name">Sign In or Register Account</span>
          <div class="buttons">
            <div id="open-login-form" class="login-btn">Login</div>
            <div id="open-register-form" class="register-btn">Register</div>
          </div>
        </div>
      </div>
      `;
    document.body.insertAdjacentHTML("beforeend", noUserPopup);
    // LISTEN TO LOGIN BUTTON
    document.getElementById("open-login-form").addEventListener("click", async () => {
      document.body.insertAdjacentHTML("beforeend", loginForm);
      console.log("LoginForm - Created");
      await loginWindow(); // show login form
      document.getElementById("loginModal").style.display = "block";
      loginRequest();
      toggleAccountPopup(); // close account popup
    });
    // LISTEN TO REGISTER BUTTON
    document
      .getElementById("open-register-form")
      .addEventListener("click", async () => {
        document.body.insertAdjacentHTML("beforeend", registerForm);
        console.log("RegisterForm - Created");
        await registerWindow(); // show login form
        document.getElementById("registerModal").style.display = "block";
        registerRequest();
        toggleAccountPopup(); // close account popup
      });
  }
}

// ============== TOGGLE ACCOUNT POPUP ======================

function toggleAccountPopup() {
  console.log("clicked account button");

  const accountPopup = document.querySelector(".account-popup");
  accountPopup.classList.toggle("active");
}

// ============== REGISTER FORM ======================

const registerForm = `
  <div id="registerModal" class="register-modal">
            <div class="register-modal-content">
              <span id="register-close" class="close">&times;</span>
              <h2 id="register-label">Register Account</h2>
              <form id="register-form">
                <label class="register-label" for="username">Username</label>
                <input class="login-input"type="text" id="username" name="username" required />

                <label class="register-label" for="password">Password</label>
                <div class="password-container">
                  <input class="login-input" type="password" id="password" name="password" required />
                  <span class="toggle-password" style="cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </span>
                </div>
                <button id="submit-btn" class="register-submit-btn" type="submit">Register</button>
              </form>
            </div>
          </div>
`;

export async function registerWindow() {
  const registerModal = document.getElementById("registerModal");
  // SHOWUP POPUP REGISTER FORM
  document.getElementById("open-register-form").onclick = function () {
    document.getElementById("registerModal").display = "block";
  };

  document.getElementById("register-close").onclick = function () {
    registerModal.style.display = "none";
    clearUserForm();
    resetPasswordToggle();
  };
  document.addEventListener("mousedown", function (event) {
    if (event.target === registerModal) {
      registerModal.style.display = "none";
      clearUserForm();
      resetPasswordToggle();
    }
  });
  await togglePasswordInput(); // enable toggle password input
}
export async function loginWindow() {
  // SHOWUP POPUP LOGIN FORM
  document.querySelector(".login-btn").onclick = function () {
    document.getElementById("loginModal").style.display = "block";
  };

  document.querySelector("#login-close").onclick = function () {
    document.getElementById("loginModal").style.display = "none";
    clearUserForm();
    resetPasswordToggle();
  };
  document.addEventListener("mousedown", function (event) {
    if (event.target === document.getElementById("loginModal")) {
      document.getElementById("loginModal").style.display = "none";
      clearUserForm();
      resetPasswordToggle();
    }
  });
  await togglePasswordInput(); // enable toggle password input
}

async function togglePasswordInput() {
  const togglePasswordVisibility = document.querySelector(".toggle-password");
  const passwordInput = document.querySelector('.login-input[name="password"]');

  togglePasswordVisibility.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePasswordVisibility.innerHTML = closedEyeSvg;
    } else {
      passwordInput.type = "password";
      togglePasswordVisibility.innerHTML = openeyeSvg;
    }
  });
}
function resetPasswordToggle() {
  const togglePasswordVisibility = document.querySelector(".toggle-password");
  if (togglePasswordVisibility.innerHTML == closedEyeSvg) {
    togglePasswordVisibility.innerHTML = openeyeSvg;
    passwordInput.type = "password";
  }
}
const openeyeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
`;

const closedEyeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
`;

export function clearUserForm() {
  // Remove any existing status message
  const statusMessageToggle = document.querySelector(".status-message");
  if (statusMessageToggle) {
    statusMessageToggle.remove();
  }

  // Clear the password field
  const passwordInput = document.querySelector('.login-input[name="password"]');
  if (passwordInput) {
    passwordInput.value = "";
  }
}
// ============== LOGIN FORM ======================
const loginForm = `
  <div id="loginModal" class="login-modal">
            <div class="login-modal-content">
              <span id="login-close" class="close">&times;</span>
              <h2 id="login-label">Login</h2>
              <form id="login-form">
                <label class="login-label" for="username">Username</label>
                <input class="login-input"type="text" id="username" name="username" required />
                <label class="login-label" for="password">Password</label>
                <div class="password-container">
                  <input class="login-input" type="password" id="password" name="password" required />
                  <span class="toggle-password" style="cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </span>
                </div>
                <button id="submit-btn" class="login-submit-btn" type="submit">Login</button>
              </form>
            </div>
          </div>
`;

// ============== LOGIN FORM ======================
