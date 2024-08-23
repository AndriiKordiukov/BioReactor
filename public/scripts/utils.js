export function formatDate(date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export function calculateSum(a, b) {
  return a + b;
}


export const API_URL = 'https://api.example.com';
export const DEBUG_MODE = true;



// SERVER SETTINGS - ADDRESS, PORT, CORS
export const server = "http://localhost:8080/";
// API METHODS
export const create = "create"; // POST request
export const byName = "byName/"; // GET request
export const get = "GET"; // GET request
export const post = "POST"; // POST request
export const patch = "PATCH"; // PATCH request
export const delets = "DELETE"; // DELETE request
// API ENDPOINTS
export const vitamins = "vitamins/";
export const minerals = "minerals/";
export const food = "food/";
export const relations = "foodNutrientRelations/";
export const interactions = "interactions/";
export const forms = "activeForms/";

export const nutrient = {
  id: 4, // initial ID number of the nutrient
  name: '',
  fullName: '',
  foodNutrientRelations: [],
  interactions: [],
  rda: ''
};

// Creating Nutrient's Active forms
export const activeForm = {
  id: 0,
  formName: '',
  description: '',
  nutrientId: nutrient.id
};
export const activeForms = [activeForm];

// Creating Food Sources
export const foodSource = {
  id: 0,
  foodName: '',
  description: ''
};
export const foodSources = [foodSource];

// Creating Food-Nutrient relationship
export const foodNutrientRelation = {
  id: 0,
  amount: '',
  description: '',
  foodId: 0,
  formId: '0',
  nutrientId: 0
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
* @param {object} [headers={}] - Additional headers for the request.
* @returns {Promise<object>} - API response in JSON format.
*/
export async function fetchAPI(url = '', method = 'GET', data = null, headers = {}) {
  const options = { // request options
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
  if (data) { // If data not null -> JSON
    options.body = JSON.stringify(data);
    console.log(options.body);
  }

  // console.log('Attempt to fetch - ' + server + url);
  const response = await fetch(server + url, options); // APIM REQUEST

  if (!response.ok) { // If response not ok -> throw error
    throw new Error(`API request failed with status code ${response.status}`);
  }
  // console.log('Response Status Code - ' + response.status);
  return await response.json(); // return API response in JSON format
}



// HEADER GENERATING
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
           </div>
       </div>
   </header>
 `;
  
// getting curent url
export const url = window.location.pathname;

// Извлекаем идентификатор витамина из URL
export const nutrientName = url.split('/').pop();
  // console.log(nutrientName);






/// HOW TO IMPORT JS

/* import { formatDate, calculateSum } from './utils.js';

console.log(formatDate(new Date())); // Выведет текущую дату в формате "dd/mm/yyyy"
console.log(calculateSum(5, 3));

// app.js
import { API_URL, DEBUG_MODE } from './config.js';

console.log(API_URL); // Выведет "https://api.example.com"
console.log(DEBUG_MODE); // Выведет true */
