let minerals = [];
let filteredFood = [];
let currentIndex = 0;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadFood();
    document.getElementById('search').addEventListener('input', filterFood);
    window.addEventListener('scroll', loadMoreFood);
});

function loadFood() {
    fetch('http://localhost:8080/minerals')
        .then(response => response.json())
        .then(data => {
          minerals = data.content;
          // console.log(JSON.stringify(minerals)); // look at the results
            filteredFood = minerals;
            renderFood();
        });
}

function renderFood() {
    const mineralList = document.getElementById('nutrient-list');
    const fragment = document.createDocumentFragment();
    for (let i = currentIndex; i < currentIndex + itemsPerPage && i < filteredFood.length; i++) {
      const mineral = filteredFood[i];
      mineral.image = '';
      console.log(mineral);
        const card = document.createElement('div');
        card.classList.add('nutrient-card');
        card.innerHTML = `
            <a href="/minerals/${mineral.name}"><img src="${mineral.image}" alt="${mineral.name}"></a>
            <h3><a href="/minerals/${mineral.name}">${mineral.name}</a></h3>
            <p>${mineral.fullName}</p>
            <p>${mineral.shortDescription}</p>
        `;
        fragment.appendChild(card);
    }
    mineralList.appendChild(fragment);
    currentIndex += itemsPerPage;
}

function filterFood(filter = '') {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    filteredFood = minerals.filter(mineral => 
        mineral.name.toLowerCase().includes(searchTerm) || 
        mineral.fullName.toLowerCase().includes(searchTerm) ||
        (filter && mineral.description.toLowerCase().includes(filter))
    );
    currentIndex = 0;
    document.getElementById('mineral-list').innerHTML = '';
    renderFood();
}

function loadMoreFood() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        renderFood();
    }
}
