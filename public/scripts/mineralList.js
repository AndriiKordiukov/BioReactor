import {
    minerals,
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
    food,
    swiperHTML,
    foodSources,
    foodNutrientRelations,
    LoadHeader,
    LoadFooter,
    loadEditLink,
  } from "./utils.js";
let mineralsData = [];
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
    let responseData = await fetchAPI(minerals);
    mineralsData = responseData.content;
    filteredFood = mineralsData;
    renderNutrients();
}

function renderNutrients() {
    const mineralList = document.getElementById('nutrient-list');
    const fragment = document.createDocumentFragment();
    for (let i = currentIndex; i < currentIndex + itemsPerPage && i < filteredFood.length; i++) {
      const mineral = filteredFood[i];
    //   console.log(mineral);
        const card = document.createElement('div');
        card.classList.add('nutrient-card');
        card.innerHTML = `
            <a href="/minerals/${mineral.name}"><img src="${mineral.image}" alt="${mineral.name}"></a>
            <div class="nutrient-name">
                <h3><a href="/minerals/${mineral.name}">${mineral.name}</a></h3>
                <p>(${mineral.fullName})</p>
            </div>
            <p>${mineral.shortDescription}</p>
        `;
        fragment.appendChild(card);
    }
    mineralList.appendChild(fragment);
    currentIndex += itemsPerPage;
}

function filterFood(filter = '') {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    filteredFood = mineralsData.filter(mineral => 
        mineral.name.toLowerCase().includes(searchTerm) || 
        mineral.fullName.toLowerCase().includes(searchTerm) ||
        (filter && mineral.description.toLowerCase().includes(filter))
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
