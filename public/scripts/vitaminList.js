let vitamins = [];
let filteredVitamins = [];
let currentIndex = 0;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadVitamins();
    // document.getElementById('search').addEventListener('input', filterVitamins);
    window.addEventListener('scroll', loadMoreNutrients);
});

function loadVitamins() {
    fetch('http://localhost:8080/vitamins')
        .then(response => response.json())
        .then(data => {
          vitamins = data.content;
          // console.log(JSON.stringify(vitamins)); // look at the results
            filteredVitamins = vitamins;
            renderNutrients();
        });
}

function renderNutrients() {
    const nutrientList = document.getElementById('nutrient-list');
    const fragment = document.createDocumentFragment();
    for (let i = currentIndex; i < currentIndex + itemsPerPage && i < filteredVitamins.length; i++) {
      const vitamin = filteredVitamins[i];
      // nutrient.image = 'picture';
      console.log(vitamin);
        const card = document.createElement('div');
      card.classList.add('nutrient-card');
      console.log(vitamin.name.toLowerCase());
      let linkName = vitamin.name.replace(/ /g, '-');
        card.innerHTML = `
            <a href="/vitamins/${linkName}"><img src="${vitamin.image}" alt="${vitamin.name}"></a>
            <h3><a href="/vitamins/${linkName}">${vitamin.name}</a></h3>
            <p>${vitamin.fullName}</p>
            <p>${vitamin.shortDescription}</p>
        `;
        fragment.appendChild(card);
    }
    nutrientList.appendChild(fragment);
    currentIndex += itemsPerPage;
}

function filterVitamins(filter = '') {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    filteredVitamins = vitamins.filter(vitamin => 
        vitamin.name.toLowerCase().includes(searchTerm) || 
        vitamin.fullName.toLowerCase().includes(searchTerm) ||
        (filter && vitamin.description.toLowerCase().includes(filter))
    );
    currentIndex = 0;
    document.getElementById('nutrient-list').innerHTML = '';
    renderVitamins();
}

function loadMoreNutrients() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        renderNutrients();
    }
}
