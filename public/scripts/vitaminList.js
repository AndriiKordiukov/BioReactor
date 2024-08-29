import {
    // minerals,
    byName,
    nutrientName,
    byNutrint,
    fetchAPI,
    activeForm,
    nutrient,
    activeForms,
    forms,
    relations,
    interactions,
    food, vitamins,
    swiperHTML,
    foodSources,
    foodNutrientRelations,
    LoadHeader,
    LoadFooter,
    loadEditLink
  } from "./utils.js";
let vitaminsData = [];
let filteredFood = [];
let currentIndex = 0;
const itemsPerPage = 10;

// LOADING CONTENT
loadNutrients();     // Load Food

// document.addEventListener('DOMContentLoaded', () => {
//     loadFood();
//     document.getElementById('search').addEventListener('input', filterFood);
//     window.addEventListener('scroll', loadMoreFood);
// });

async function loadNutrients() {
    let responseData = await fetchAPI(vitamins);
    vitaminsData = responseData.content;
    filteredFood = vitaminsData;
    renderNutrients();
}

function renderNutrients() {
    const vitaminList = document.getElementById('nutrient-list');
    const fragment = document.createDocumentFragment();
    for (let i = currentIndex; i < currentIndex + itemsPerPage && i < filteredFood.length; i++) {
      const vitamin = filteredFood[i];
    //   console.log(vitamin);
        const card = document.createElement('div');
        card.classList.add('nutrient-card');
        card.innerHTML = `
            <a href="/vitamins/${vitamin.name}"><img src="${vitamin.image}" alt="${vitamin.name}"></a>
            <div class="nutrient-name">
                <h3><a href="/vitamins/${vitamin.name}">${vitamin.name}</a></h3>
                <p>(${vitamin.fullName})</p>
            </div>
            <p>${vitamin.shortDescription}</p>
        `;
        fragment.appendChild(card);
    }
    vitaminList.appendChild(fragment);
    currentIndex += itemsPerPage;
}

function filterFood(filter = '') {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    filteredFood = vitaminsData.filter(vitamin => 
        vitamin.name.toLowerCase().includes(searchTerm) || 
        vitamin.fullName.toLowerCase().includes(searchTerm) ||
        (filter && vitamin.description.toLowerCase().includes(filter))
    );
    currentIndex = 0;
    document.getElementById('nutrient-list').innerHTML = '';
    renderNutrients();
}

function loadMoreFood() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        renderNutrients();
    }
}
