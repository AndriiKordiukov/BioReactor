import {
  vitamins,
  byName,
  nutrientName,
  byNutrint,
  fetchAPI,
  forms,
  relations,
  interactions,
  food,
  swiperHTML,
  LoadHeader,
  LoadFooter,
  loadEditLink,
} from "./utils.js";

// SERVICE PART
var nutrientId = 0;
var rda;

// LOADING CONTENT

nutrientId = await loadingVitamin(); // Load Vitamin by Name
await loadingActiveForms(nutrientId); // Load Active Forms
await RDA(rda); // Load RDA
await LoadFoodScources(nutrientId); // Load Food Sources
await loadInteractions(nutrientId); // Load Interactions
await loadEditLink(nutrientId); // Load Edit Link

// ============================================
// =========== FUNCTIONS ======================
// ============================================

async function loadingVitamin() {

  let responseData = await fetchAPI(vitamins + byName + `${nutrientName}`);
  nutrientId = await responseData.id;
  rda = await responseData.rda;

  // Filling the nutrient details on the page
  document.getElementById("nutrient-name").textContent = responseData.name;
  document.getElementById("nutrient-image").src = responseData.image;
  document.getElementById("nutrient-description").textContent =
    responseData.shortDescription;
  document.getElementsByTagName("title").textContent = responseData.name;
  return nutrientId;
}

// GOTO -> utils.js
async function loadingActiveForms(NutrientId) {
  let activeForms = await fetchAPI(forms + byNutrint + NutrientId);
  console.log(forms + byNutrint + NutrientId);
  

  for (let i = 0; i < activeForms.length; i++) {

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

async function RDA(rda) {
  // Fiiling the list of active forms on the page
  const rdaPart = document.getElementById("rda-description");
  rdaPart.insertAdjacentHTML("afterbegin", rda);
  //   rdaPart.textContent = rda;

  // document.getElementById("nutrient-forms")
  // .insertAdjacentHTML('afterend', rda); //Insert RDA HTML tag after Active Forms list
}

async function LoadFoodScources(NutrientId) {
  let bfsDiv = document.querySelector(".food-sources");
  bfsDiv.insertAdjacentHTML("beforeend", swiperHTML);
  let foodCard = bfsDiv.querySelector(".swiper-wrapper");

  // Fetch food sources data from API
  let foodNutrientRelations = await fetchAPI(
    relations + byNutrint + NutrientId
  );
  // console.log(foodNutrientRelations);
  // console.log("Number of steps: " + foodNutrientRelations.length);

  for (let i = 0; i < foodNutrientRelations.length; i++) {
    let foodSources = await fetchAPI(food + foodNutrientRelations[i].food);
    // console.log(foodSources);
    let foodName = foodSources.foodName;
    let foodNameUrl = foodName.replace(/ /g, "-");
    let foodImage = foodSources.image;
    let foodDescription = foodSources.description;

    const cardHTML = document.createElement("div");
    cardHTML.classList.add("swiper-slide");
    cardHTML.innerHTML = `       
          <div class="card">
            <div class="image-content">
              <span class="overlay"></span>
              <div class="card-image">
                <img
                  src="${foodImage}"
                  alt="sda"
                  class="card-img"
                />
              </div>
            </div>
            <div class="card-content">
              <h2 class="card-name">${foodName}</h2>
              <p class="description">${foodDescription}</p>
              <a href="/food/${foodNameUrl}">
              <button class="more-button">Details</button>
              </a>
            </div>
          </div>
        `;

    foodCard.appendChild(cardHTML);
    // console.log("step:" + (i + 1));
    // foodCard.insertAdjacentElement("beforeend", cardHTML);
  }
}
var swiper = new Swiper(".mySwiper", {  // Initialize Swiper for food sources slider
  slidesPerView: 2,
  spaceBetween: 30,
  loop: true,
  centerSlides: "true",
  fade: "true",
  grabCursor: "true",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: "3000",
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    380: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    950: {
      slidesPerView: 4,
      spaceBetween: 25,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 25,
    },
  },
});
// SWIPER AUTOPLAY
// swiper.autoplay.stop();
const swiperContainer = document.querySelector(".swiper");
swiperContainer.addEventListener("mouseover", (e) => {
  // swiper.autoplay.start();
  swiper.autoplay.stop();
});
swiperContainer.addEventListener("mouseout", () => {
  // swiper.autoplay.stop();
  swiper.autoplay.stop();
});

async function loadInteractions(NutrientId) {
  let interactionsData = await fetchAPI(interactions + byNutrint + NutrientId);
  console.log(interactionsData);
  // console.log("Number of interactions: ", interactionsData.length);

  for (let i = 0; i < interactionsData.length; i++) {
    // console.log(interactionsData[i]);
    // Filling the list of interactions on the page
    const interactions = document.createElement("li");
    interactions.classList.add("interaction");
    interactions.textContent = interactionsData[i].interaction;
    document.querySelector(".interactions").appendChild(interactions);
  }
}
