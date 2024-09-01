import {
  byName, byFood,
  nutrientName,
  url,
  byNutrint, byNutrientId,
  fetchAPI,
  forms,
  relations,
  food,
  foodNutrientRelations,
  LoadHeader,
  LoadFooter,
  loadEditLink,
  checkNutrientType
} from "./utils.js";

// SERVICE PART
var nutrientId = 0;
var foodObject = [];

// LOADING CONTENT
const foodId = await loadingFood(); // Load Food by Name

// NutrientId = await loadingVitamin(); // Load Vitamin by Name
// await LoadFoodScources(nutrientId); // Load Food Sources
// await loadingActiveForms(nutrientId); // Load Active Forms
await LoadFoodNutrients();        // Load Food Nutrients
await loadEditLink(foodObject.id); // Load Edit Link
// await LoadFoodNutrients(foodId); // Load Food Nutrients

// ============================================
// =========== FUNCTIONS ======================
// ============================================

async function loadingFood() {

  let responseData = await fetchAPI(food + byName + `${url.split("/").pop()}`);
  foodObject = responseData;
  console.log(responseData);

  // Filling the nutrient details on the page
  document.getElementById("food-name").textContent = foodObject.foodName;
  document.getElementById("food-image").src = foodObject.image;
  document.getElementById("food-description").textContent =
    foodObject.description;
  document.getElementsByTagName("title").textContent = foodObject.name;
  return foodObject.id;
}



async function LoadFoodNutrients() {
  if (foodObject.foodNutrientRelations != null) {
    let nutrientsDiv = document.querySelector(".nutrients");
    // bfsDiv.insertAdjacentHTML("beforeend", nutrientTableHTML);
    let nutrientTableBody = nutrientsDiv.querySelector("tbody");

    // Fetch food sources data from API
    // let foodNutrientRelations = await fetchAPI(relations + byFood + foodId);

    console.log(foodObject.foodNutrientRelations);
    console.log("Number of nutrients: " + foodObject.foodNutrientRelations.length);
  
    let nutrientForm = 'None';
    for (let i = 0; i < foodObject.foodNutrientRelations.length; i++) {
      // Getting Active form
      if (foodObject.foodNutrientRelations.forms != null) {
        let form = await fetchAPI(forms + foodObject.foodNutrientRelations[i].forms);
        nutrientForm = form.formName;
      }
      // Getting Nutrient
      let nutrient = await fetchAPI(
        relations + byNutrientId + foodObject.foodNutrientRelations[i].nutrient);
      console.log(nutrient);
      // Filling variables
      let nutrientName = nutrient.name;
      let nutrientType = nutrient.nutrientType;
      
      
      let nutrientUrl = nutrient.nutrientType + '/' + nutrientName.replace(/ /g, "%20");
      console.log(nutrientUrl);
      
      let nutrientAmount = foodObject.foodNutrientRelations[i].amount;
      let nutrientFoodDescription = foodObject.foodNutrientRelations[i].description;
      let nutrientShortDescription = nutrientFoodDescription.substring(0, 55) + '...';

      // TABLE ROW HTML
      const nutrientTableHTML = `
      <td><a href=/${nutrientUrl}>${nutrientName}</a></td>
      <td>${nutrientForm}</td>
      <td>${nutrientAmount}</td>
      <td class="nutrientDescription" data-description="${nutrientFoodDescription}">${nutrientShortDescription}</td>

    `;

      const nutrientRow = document.createElement("tr");

      nutrientRow.classList.add("nutrient-row");
      nutrientRow.innerHTML = nutrientTableHTML;

      nutrientTableBody.appendChild(nutrientRow);
    }
  }
}

document.querySelectorAll('.nutrientDescription').forEach(item => {
  let hideTimeout;
  let resetTimeout;

  item.addEventListener('click', function() {
      // Найти или создать элемент всплывающего окна
      let popup = this.querySelector('.description-popup');
      if (!popup) {
          popup = document.createElement('div');
          popup.className = 'description-popup';
          popup.textContent = this.getAttribute('data-description');
          this.appendChild(popup);
      }

      // Отменяем старый таймер скрытия, если был
      clearTimeout(hideTimeout);
      clearTimeout(resetTimeout);

      // Показать всплывающее окно
      popup.style.visibility = 'visible';
      popup.style.opacity = '1';

      // Таймер на скрытие через 5 секунд после клика
      hideTimeout = setTimeout(() => {
          popup.style.visibility = 'hidden';
          popup.style.opacity = '0';
      }, 5000);

      // Обновляем таймер скрытия при наведении на всплывающее окно
      popup.addEventListener('mouseover', function() {
          clearTimeout(hideTimeout); // Остановить скрытие
          resetTimeout = setTimeout(() => {
              popup.style.visibility = 'hidden';
              popup.style.opacity = '0';
          }, 10000); // Обновляем таймер до 2 секунд
      });

      // Останавливаем таймер обновления при уходе с всплывающего окна
      popup.addEventListener('mouseleave', function() {
          clearTimeout(resetTimeout);
          // Перезапускаем таймер скрытия через 5 секунд
          hideTimeout = setTimeout(() => {
              popup.style.visibility = 'hidden';
              popup.style.opacity = '0';
          }, 3000);
      });

      // Автоматическое закрытие при клике вне окна
      document.addEventListener('click', function(e) {
          if (!item.contains(e.target)) {
              popup.style.visibility = 'hidden';
              popup.style.opacity = '0';
          }
      }, { once: true });
  });
});




async function loadingVitamin() {

  let responseData = await fetchAPI(vitamins + byName + `${nutrientName}`);
  nutrientId = await responseData.id;
  rda = await responseData.rda;

  // responseData = await response.json();

  console.log(responseData);

  // Filling the nutrient details on the page
  document.getElementById("nutrient-name").textContent = responseData.name;
  document.getElementById("nutrient-image").src = responseData.image;
  document.getElementById("nutrient-description").textContent =
    responseData.shortDescription;
  document.getElementsByTagName("title").textContent = responseData.name;
  return nutrientId;
}
async function loadingActiveForms(NutrientId) {
  let activeForms = await fetchAPI(forms + byNutrint + NutrientId);

  console.log("Active FORMS = " + JSON.stringify(activeForms));

  for (let i = 0; i < activeForms.length; i++) {
    console.log(activeForms[i]);
    // Fiiling the list of active forms on the page
    const forms = document.createElement("li");
    forms.classList.add("active-form");
    forms.textContent = activeForms[i].formName;
    // forms.addEventListener('mouseover', () => toggleFormDescription(forms));
    document.getElementById("nutrient-forms").appendChild(forms);

    const formDescription = document.createElement("p");
    formDescription.classList.add("form-description");
    formDescription.textContent = activeForms[i].description;
    formDescription.style.display = "none";
    forms.appendChild(formDescription);
  }
}

function toggleFormDescription(forms) {
  forms.querySelector(".form-description").style.display =
    forms.querySelector(".form-description").style.display === "none"
      ? "block"
      : "none";
}