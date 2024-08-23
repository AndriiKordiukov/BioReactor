// SERVER SETTINGS - ADDRESS, PORT, CORS
const server = "http://localhost:8080/";
// API METHODS
const create = "create"; // POST request
const post = "POST"; // POST request
const patch = "PATCH"; // PATCH request
const delets = "DELETE"; // DELETE request
// API ENDPOINTS
const vitamins = "vitamins/";
const minerals = "minerals/";
const food = "food/";
const relations = "foodNutrientRelations/";
const interactions = "interactions/";
const forms = "activeForms/";

const nutrient = {
  id: 0, // initial ID number of the nutrient
  name: '',
  fullName: '',
  foodNutrientRelations: [],
  interactions: [],
  rda: ''
};
const activeForm = {
  id: 0,
  formName: '',
  description: '',
  nutrientId: nutrient.id
}
const activeForms = [activeForm];

// API REQEST BUILDER

async function sendApiRequest(method, endpoint, data) {
  const response = await fetch(server + endpoint, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      // Accept: "*/*"
    },
    mode: 'cors',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.log(data);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;  //Data;
}

// ADD MINERAL
    const form = document.getElementById("api-form");
    const successMessage = document.getElementById("success-message");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      let nutrientInputData = new FormData(event.target);
      
      const requestData = { // building request data
        name: nutrientInputData.get("name"),
        fullName: nutrientInputData.get("fullName"),
        rda: nutrientInputData.get("rda")
      };

      response = await sendApiRequest(
        post,
        nutrientInputData.get("optional") + '/' +create,
        requestData);
       
      

      if (response.ok) {
        const responseData = await response.json();
        const data = await JSON.stringify(responseData);
        console.log("RESPONSE STATUS" + response.status);
        console.log("RESPONSE DATA - " + data);

        nutrient.id = responseData.id; // updating nutrient ID
        nutrient.name = requestData.name;
        nutrient.fullName = requestData.fullName;
        nutrient.rda = requestData.rda;

        console.log(nutrient);
        
        // Проверка полученных данных
        if (responseData.name === requestData.name &&
          responseData.fullName === requestData.fullName &&
          responseData.rda === requestData.rda) {
          successMessage.textContent = `Created succesfull, ID: ${responseData.id}`;
          addFormAndSaveButton();
          
        } else {
          successMessage.textContent = "Creation Failed";
        }
      } 
    });
// --------------------------------------------------------------------------
// ---------------------------- ADD FORMS -----------------------------------
// --------------------------------------------------------------------------
const container = document.querySelector('.container');
var formCounter = 0; // Counts Active form's forms

function createFormContainer() {
  const formContainer = document.createElement('div');
  formContainer.id = 'form-container';
  return formContainer;
}

function createSuccesMessage(id, message, subling) {
  const successMessage = document.createElement('div');
  successMessage.className = 'success-message';
  successMessage.id = `success-message-${id}`;
  successMessage.textContent = message;
  successMessage.style.color = 'green';
  successMessage.style.marginBottom = '10px';
  subling.parentNode.appendChild(successMessage);
  return successMessage;
}

function createSaveButton() {
  const saveBtn = document.createElement('button');
  saveBtn.id = 'save-btn';
  saveBtn.textContent = 'Save';

  saveBtn.addEventListener('click', () => {
    // Реализуйте вашу кастомную функцию здесь
    saveFormsData();
  });

  return saveBtn;
}

function createAddFormButton() {
  const addBtn = document.createElement('button');
  addBtn.id = 'add-form';
  addBtn.textContent = '+';

  addBtn.addEventListener('click', () => {
    addForm(container);
  });

  return addBtn;
}

function addFormAndSaveButton() {
  const formContainer = createFormContainer();
  const addBtn = createAddFormButton();
  const saveBtn = createSaveButton();

  container.appendChild(formContainer);
  container.appendChild(addBtn);
  container.appendChild(saveBtn);

  addForm(formContainer);
}

function createFormElement() {
  formCounter++; // forms counter starts from 0
  
  const formContainer = document.createElement('form');
  formContainer.className = 'form-container';

  const formLabel = document.createElement('label');
  formLabel.textContent = `Form №${formCounter}`;

  const hideBtn = document.createElement('button');
  hideBtn.classNamed = 'hide-btn';
  hideBtn.textContent = '-';
  hideBtn.addEventListener('click', () => {
    formContainer.remove();
    formCounter--;
  });

  // Creating Active Form's' name and description input fields
  const formInput = document.createElement('input');
  formInput.type = 'text';
  formInput.className = 'formName';
  formInput.placeholder = 'Form';

  const descInput = document.createElement('input');
  descInput.type = 'text';
  descInput.className = 'formDescription';
  descInput.placeholder = 'Form Description';

  formContainer.appendChild(formLabel); // Appending formLabel

  if (formCounter > 1) { 
    formContainer.appendChild(hideBtn); // Adding Hide Button only starting from the second form
  }
  
  formContainer.appendChild(formInput); // adding new formName input field
  formContainer.appendChild(descInput); // adding new formDescription input field

  return formContainer;
}

function addForm(parentContainer) {
  const newForm = createFormElement();
  subling = document.querySelector('#add-form');
  subling.parentNode.insertBefore(newForm, subling);
  // parentContainer.appendChild(newForm);
}

// addFormAndSaveButton(); // SHOW ALWAYS

async function saveFormsData() {
  let formNamesInput = document.querySelectorAll('.formName'); // Finding ActiveForms name input fields
  let formDescriptionInput = document.querySelectorAll('.formDescription'); // Finding ActiveForms description input fields
  let formNames = Array.from(formNamesInput).map(input => input.value);
  let formDescriptions = Array.from(formDescriptionInput).map(input => input.value);
  let response = [];
  // Building request body for active forms
  let activeFormsRequest = [];
  for (let i = 0; i < formNames.length; i++) { 
    activeFormsRequest[i] = {
      "formName": formNames[i],
      "description": formDescriptions[i],
      "nutrientId": nutrient.id
    };
    console.log('Active Forms request - ' + JSON.stringify(activeFormsRequest[i])); // final request data test
    response[i] = await sendApiRequest(post, forms + create, activeFormsRequest[i]);
    if (response[i].ok) {
      console.log('Forms Creating Response STATUS - ' + response[i].status); // debugging purposes
      activeForms[i] = await response[i].json();//activeForm; LOCAL OBJECT FROM RESPONSE
      console.log('Active Forms new -' + JSON.stringify(activeForms[i])); // Local array object from response
      
      createSuccesMessage(
        'activeForm-' + activeForms[i].id,
        "Form with id = " + activeForms[i].id + " created succesfull",
        formDescriptionInput[i]);
    } else {
      console.log('Error sending the Active Forms request');
    }
  }




}

// --------------------------------------------------------------------------
// ----------------------------- ADD FOOD -----------------------------------
// --------------------------------------------------------------------------

function createFoodForm() {
  const form = document.createElement('form');
  form.id = 'food-form';

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.placeholder = 'Name';
  nameInput.required = true;

  const descriptionInput = document.createElement('textarea');
  descriptionInput.placeholder = 'Description';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';

  form.appendChild(nameInput);
  form.appendChild(descriptionInput);
  form.appendChild(saveBtn);

  return form;
}