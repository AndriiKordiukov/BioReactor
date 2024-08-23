import {
    vitamins, byName, nutrientName,
    fetchAPI, headerHTML
} from "./utils.js";


loadingVitamin();


async function loadingVitamin() {
   // Insert the header HTML at the beginning of the body
    document.body.insertAdjacentHTML('beforebegin', headerHTML);

    let responseData = await fetchAPI(vitamins + byName + `${nutrientName}`);
    // responseData = response.json();

    console.log(responseData);

          // Заполняем страницу полученными данными
          document.getElementById("nutrient-name").textContent = responseData.name;
          document.getElementById("nutrient-image").src = responseData.image;
          document.getElementById("nutrient-description").textContent = responseData.shortDescription;

}
