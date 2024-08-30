import { fetchAPI, forms, byNutrientId, byNutrint } from "./utils.js";

const block1 = document.getElementById("block1");

const categorySelector = document.getElementById("category");
const itemSelector = document.getElementById("item-list");

categorySelector.addEventListener("change", loadCategorie);

itemSelector.addEventListener("change", loadItem);
var responseData = [];

async function loadCategorie() {
  itemSelector.innerHTML = `<option id="default-item" value="">Select an item</option>`;
  document.getElementById("default-item").innerText = categorySelector.value;
  document.getElementById("item-label").innerText = capitalizeFirstLetter(categorySelector.value);
  try {
    let response = await fetchAPI(categorySelector.value);
    responseData = await response.content;
    console.log(responseData);
    

    itemSelector.innerHTML = ""; // Clear previous options
    for (const item of responseData) {
      if (item.name) {
        itemSelector.innerHTML += `
            <option value="${item.id}">${item.name}</option>
          `;
      } else {
        itemSelector.innerHTML += `
            <option value="${item.id}">${item.foodName}</option>
          `;
      }
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}


async function loadItem() {
  let itemImage = document.getElementById("item-image");
  let showMoreBtn = document.getElementById("show-more");
  let justName = document.getElementById("just-name");
  let itemFullName = document.getElementById("full-name");
  let formsH4 = document.getElementById("forms-h4");
  let itemLink = document.getElementById("item-link");

  let currentItem = await findObjectById(responseData, itemSelector.value);
  try {
    if (currentItem.name) { // IF CHOOSE NUTRIENT
      let responseForms = await fetchAPI(forms + byNutrint + itemSelector.value);
      console.log(responseForms);
      itemImage.src = currentItem.image;
      showMoreBtn.style.display = "block";
      itemLink.href = categorySelector.value + '/' + currentItem.name;
      formsH4.innerText = 'Active Forms:';
      justName.innerText = currentItem.name;
      itemFullName.innerText = currentItem.fullName;
      for (let i = 0; i < responseForms.length; i++) {
        document.getElementById("forms").innerHTML += `
          <li class="forms-list">
            ${responseForms[i].formName}
          </li>
        `;
      }
    } else if (currentItem.foodName) { // IF CHOOSE FOOD
      justName.innerText = currentItem.foodName;
      itemFullName.innerText = '';
      formsH4.innerText = '';
      itemImage.src = currentItem.image;
      showMoreBtn.style.display = "block";
      itemLink.href = categorySelector.value + '/' + currentItem.name;
      document.getElementById("forms").innerHTML = currentItem.description;
    }
  }
  catch (error) {
    console.error("Error loading item:", error);
  }
}












  function findObjectById(array, id) {
    return array.find(obj => obj.id == id);
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
