let foods = [];
let filteredFood = [];
let currentIndex = 0;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadFood();
    //document.getElementById('search').addEventListener('input', filterFood);
    window.addEventListener('scroll', loadMoreFood);
});

function loadFood() {
    fetch('http://localhost:8080/food')
        .then(response => response.json())
        .then(data => {
          foods = data.content;
          // console.log(JSON.stringify(foods)); // look at the results
            filteredFood = foods;
            renderFood();
        });
}

function renderFood() {
    const foodList = document.getElementById('food-list');
    const fragment = document.createDocumentFragment();
    for (let i = currentIndex; i < currentIndex + itemsPerPage && i < filteredFood.length; i++) {
      const food = filteredFood[i];
      food.image = 'picture';
      console.log(food);
        const card = document.createElement('div');
        card.classList.add('nutrient-card');
        card.innerHTML = `
            <a href="/food/${food.foodName}"><img src="${food.image}" alt="${food.foodName}"></a>
            <h3><a href="/food/${food.foodName}">${food.foodName}</a></h3>
            <p>${food.foodName}</p>
            <p>${food.description}</p>
        `;
        fragment.appendChild(card);
    }
    foodList.appendChild(fragment);
    currentIndex += itemsPerPage;
}

function filterFood(filter = '') {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    filteredFood = foods.filter(foods => 
      food.foodName.toLowerCase().includes(searchTerm) || 
      food.foodName.toLowerCase().includes(searchTerm) ||
        (filter && food.description.toLowerCase().includes(filter))
    );
    currentIndex = 0;
    document.getElementById('nutrient-list').innerHTML = '';
    renderFood();
}

function loadMoreFood() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
        renderFood();
    }
}
