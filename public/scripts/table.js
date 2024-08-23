
// SERVER SETTINGS - ADDRESS, PORT, CORS
const server = "http://localhost:8080/";
// API METHODS
const create = "create"; // POST request
const byName = "byName/"; // GET request
const get = "GET"; // GET request
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
  id: 4, // initial ID number of the nutrient
  name: '',
  fullName: '',
  foodNutrientRelations: [],
  interactions: [],
  rda: ''
};

// Creating Nutrient's Active forms
const activeForm = {
  id: 0,
  formName: '',
  description: '',
  nutrientId: nutrient.id
};
const activeForms = [activeForm];

// Creating Food Sources
const foodSource = {
  id: 0,
  foodName: '',
  description: ''
};
const foodSources = [foodSource];

// Creating Food-Nutrient relationship
const foodNutrientRelation = {
  id: 0,
  amount: '',
  description: '',
  foodId: 0,
  formId: '0',
  nutrientId: 0
};
const foodNutrientRelations = [foodNutrientRelation];

// Creating Nutrients Interactions
const nutrientsInteraction = {
  id: 0,
  firstNutrient: 0,
  secondNutrient: 0,
  interaction: "",
};
const nutrientsInteractions = [nutrientsInteraction];

/**
* Sends a dynamic API request and returns a response.
*
* @param {string} url - The URL of the API request.
* @param {string} [method='GET'] - HTTP request method (GET, POST, PUT, DELETE, etc.).
* @param {object} [data=null] - The data to be sent in the request body.
* @param {object} [headers={}] - Additional headers for the request.
* @returns {Promise<object>} - API response in JSON format.
*/
async function fetchAPI(url = '', method = 'GET', data = null, headers = {}) {
  const options = { // request options
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
  if (data) { // If data not null -> JSON
    options.body = JSON.stringify(data);
    console.log(options.body);
  }

  // console.log('Attempt to fetch - ' + server + url);
  const response = await fetch(server + url, options); // APIM REQUEST

  if (!response.ok) { // If response not ok -> throw error
    throw new Error(`API request failed with status code ${response.status}`);
  }
  // console.log('Response Status Code - ' + response.status);
  return await response.json(); // return API response in JSON format
}

// ADD MINERAL
const form = document.getElementById("api-form");
const successMessage = document.getElementById("success-message");

const formTable = document.getElementById('form-table');
// const tbodyForm = formTable.getElementsByTagName('tbody')[0];

const foodTable = document.getElementById('food-table');
// const tbodyFood = formTable.getElementsByTagName('tbody')[0];

const interactionTable = document.getElementById('interaction-table');


console.log("================================");
console.log("add Forms by Nutrient");
addFormsByNutrient(nutrient); // Initializing table with Active Forms
addFooodRelationsByNutrient(nutrient); // Initializing table with Food Sources
addInteractionsByNutrient(nutrient)
addNewBtn(formTable, activeForm, creatingFormRow); // Adding a "+" button
addNewBtn(foodTable, foodSource, creatingFoodRow); // Adding a "+" button
addNewBtn(interactionTable, nutrientsInteraction, creatingInteractionRow); // Adding a "+" button




form.addEventListener("submit", async (event) => {
  event.preventDefault();

  let nutrientInputData = new FormData(event.target);
  
  const requestData = { // building request data
    name: nutrientInputData.get("name"),
    fullName: nutrientInputData.get("fullName"),
    rda: nutrientInputData.get("rda")
  };

  const responseData = await fetchAPI(
    nutrientInputData.get("optional") + '/' + create,
    post,
    requestData);
  
  const data = await JSON.stringify(responseData);

  console.log("RESPONSE DATA - " + data);

  nutrient.id = responseData.id; // updating nutrient ID
  nutrient.name = requestData.name;
  nutrient.fullName = requestData.fullName;
  nutrient.rda = requestData.rda;
    
  // Проверка полученных данных
  if (responseData.name === requestData.name &&
    responseData.fullName === requestData.fullName &&
    responseData.rda === requestData.rda) {
    successMessage.textContent = `Created succesfull, ID: ${responseData.id}`;
  };
});

function addNewBtn(table ,object, functionName) {  
  let addRowButton = document.createElement('span');
  addRowButton.className = 'add-row';
  addRowButton.style.position = "absolute";
  addRowButton.style.width = "24px";
  addRowButton.style.height = "24px";
  addRowButton.style.backgroundSize = "contain";
  // Event handler for the "Add" button
  addRowButton.addEventListener('click', () => {
    console.log('clicked Add');
    const newRow = functionName(object);
    
    table.getElementsByTagName('tbody')[0].append(newRow);
  });

  table.appendChild(addRowButton);
}

// ====================== NEW FORM LINE IN TABLE =========================
function creatingFormRow(activeFormObject) {
  const row = document.createElement('tr');

  const idCell = document.createElement('td');
  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.value = activeFormObject.id; // insert Active Form ID
  idInput.classList.add('id-input');
  idInput.disabled = true; // inactive by default
  idCell.appendChild(idInput);

  const nameCell = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = activeFormObject.formName; // insert Active Form name
  nameInput.classList.add('editable', 'formName-input');
  nameInput.disabled = true; // inactive by default
  nameCell.appendChild(nameInput);

  const descriptionCell = document.createElement('td');
  const descriptionInput = document.createElement('input');
  descriptionInput.type = 'text';
  descriptionInput.value = activeFormObject.description; // insert Active Form description
  descriptionInput.classList.add('editable', 'description-input');
  descriptionInput.disabled = true; // inactive by default
  descriptionCell.appendChild(descriptionInput);
 // TEXT EDITOR
 descriptionInput.addEventListener('click', () => {
  const expandedTextField = document.createElement('textarea');
  expandedTextField.classList.add('expanded-text-field');
  expandedTextField.value = descriptionInput.value;
  expandedTextField.placeholder = 'Type description here...';

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  document.body.appendChild(expandedTextField);
  document.body.appendChild(overlay);

  expandedTextField.focus();

   overlay.addEventListener('click', () => {
    descriptionInput.value = expandedTextField.value;
    document.body.removeChild(expandedTextField);
    document.body.removeChild(overlay);
    });
  });

  // Adding Buttons to the table
  const actionCell = document.createElement('td'); // new column
  const editButton = document.createElement('i'); // new Edit button
  // editButton.textContent = 'Edit'; // button text
  editButton.classList.add('edit-button'); // add class to the button
  editButton.addEventListener('click', () => toggleEditMode(row)); // add event listener to the button
  // Another button
  const saveButton = document.createElement('i'); // new Save button
  saveButton.textContent = 'Save'; // button text
  saveButton.classList.add('save-button'); // add class to the button
  saveButton.addEventListener('click', () => saveRow(row));  // add event listener to the button
  saveButton.style.display = 'none'; // Hide Save button by default
  actionCell.appendChild(editButton); // Add Edit button to the action cell
  actionCell.appendChild(saveButton);  // Add Save button to the action cell

  // Creating a row with inputs and buttons
  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(descriptionCell);
  row.appendChild(actionCell);
  idInput.value = activeFormObject.id; // insert Active Form ID
  return row;
}

// EDIT mode function
function toggleEditMode(row) {
  console.log('EDIT');
  const editableInputs = row.querySelectorAll('.editable');

  editableInputs.forEach((input) => {
    input.disabled = false; // Меняем состояние disabled
    input.classList.toggle('active');
  });
  editSaveBtn(row);
}

// Function for SAVE button
async function saveRow(row) {
  let formId = row.querySelector('.id-input').value; // insert Form ID (same as in the form object
  console.log('SAVE ROW - ' + formId);
  let editableInputs = row.querySelectorAll('.editable');
  let data = {
    formName: editableInputs[0].value,
    description: editableInputs[1].value,
    nutrientId: nutrient.id, // insert Nutrient ID (same as in the nutrient object)
  };

  let responseSave;
  if (formId == '0') {
    responseSave = await fetchAPI(forms + create, post, data);
    formId.value = responseSave.id; // update Form ID
  } else {
    data.id = formId; // only for patching
    responseSave = await fetchAPI
      (forms + formId, patch, data);
  }

  if (responseSave.formName == data.formName) { 
    console.log('Data updated successfully');
    activeForm.formName = responseSave.formName; 
    createCheckmark(row);
  }
  editableInputs.forEach((input) => {
    input.disabled = true;
    input.classList.remove('active');
  });
  editSaveBtn(row); // replacing buttons

  console.log('Saved data:', data);
}

function findRowIndex(row) { 
  let rows = row.parentNode.parentNode.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  let rowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i] === row) {
      rowIndex = i;
      break;
    }
  }
  console.log(`Row index: ${rowIndex + 1}`);
  return rowIndex;
}

// Adding a first row to the table
async function addFormsByNutrient(nutrient) {

  let responseData = await fetchAPI(forms + 'byNutrient/' + nutrient.id);
  console.log('number of Active Forms - ' + responseData.length); 

    for (let i = 0; i < responseData.length; i++) {
      activeForms[i] = responseData[i]; // filling Active Forms array with received data
      formTable.getElementsByTagName('tbody')[0].appendChild(creatingFormRow(activeForms[i]));
    }
}

// Changing Save/Edit button visibility based on edit mode
function editSaveBtn(row) {
  const editButton = row.querySelector('.edit-button');
  const saveButton = row.querySelector('.save-button');
  editButton.style.display = editButton.style.display === 'none' ? 'inline-block' : 'none';
  saveButton.style.display = saveButton.style.display === 'none' ? 'inline-block' : 'none';
}

function createNewForm() { 
  return activeForm = {
    id: 0,
    formName: '',
    description: '',
    nutrientId: nutrient.id
  }
}

function createCheckmark(targetElement) {
  // Creating new element <i> for a checkmark
  const checkmarkElement = document.createElement("i");
  checkmarkElement.id = "checkmark";
  
  // add styles to the checkmark element
  checkmarkElement.style.position = "absolute";
  checkmarkElement.style.width = "24px";
  checkmarkElement.style.height = "24px";
  checkmarkElement.style.backgroundSize = "contain";
  checkmarkElement.style.pointerEvents = "none";
  
  // Positioning
  const targetRect = targetElement.getBoundingClientRect();
  checkmarkElement.style.left = `${targetRect.left + targetRect.width -5}px`;
  checkmarkElement.style.top = `${targetRect.top + targetRect.height - 40}px`;
  
  // Adding checkmark to a DOM
  targetElement.lastChild.appendChild(checkmarkElement);

  // Hiding in 1 secon
  checkmarkElement.style.transition = "opacity 1s ease-in-out";
  setTimeout(() => {
    checkmarkElement.style.opacity = "0";
    setTimeout(() => {
      targetElement.lastChild.removeChild(checkmarkElement);
    }, 1000); // Removing after 1 second
  }, 5000);
}

function creatingFoodRow(activeFoodObject, activeFormObject = activeForm, relationObject = foodNutrientRelation) {
  const row = document.createElement('tr');

  const idCell = document.createElement('td');
  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.value = activeFoodObject.id; // insert Food ID
  idInput.classList.add('id-input');
  idInput.disabled = true; // inactive by default
  idCell.appendChild(idInput);

  const nameCell = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = activeFoodObject.foodName; // insert Active Form name
  nameInput.classList.add('editable', 'foodName-input');
  nameInput.disabled = true; // inactive by default
  nameCell.appendChild(nameInput);

  const foodDescriptionCell = document.createElement('td');
  const foodDescriptionInput = document.createElement('input');
  foodDescriptionInput.type = 'text';
  foodDescriptionInput.value = activeFoodObject.description; // insert Active Form description
  foodDescriptionInput.classList.add('editable', 'foodDescription-input');
  foodDescriptionInput.disabled = true; // inactive by default
  foodDescriptionCell.appendChild(foodDescriptionInput);

  const formFoodCell = document.createElement('td');
  const formFoodInput = document.createElement('input');
  formFoodInput.type = 'text';
  formFoodInput.value = activeForm.formName; // insert Active Form name
  formFoodInput.classList.add('editable', 'formName-input');
  formFoodInput.disabled = true; // inactive by default
  formFoodCell.appendChild(formFoodInput);

  const formAmountCell = document.createElement('td');
  const formAmountInput = document.createElement('input');
  formAmountInput.type = 'text';
  formAmountInput.value = relationObject.amount; // insert Active Form name
  formAmountInput.classList.add('editable', 'formAmount-input');
  formAmountInput.disabled = true; // inactive by default
  formAmountCell.appendChild(formAmountInput);

  const descriptionRelationCell = document.createElement('td');
  const descriptionRelationInput = document.createElement('input');
  descriptionRelationInput.type = 'text';
  descriptionRelationInput.value = relationObject.description; // insert Active Form description
  descriptionRelationInput.classList.add('editable', 'relationDescription-input');
  descriptionRelationInput.disabled = true; // inactive by default
  descriptionRelationCell.appendChild(descriptionRelationInput);
 
  // TEXT EDITOR
  // foodDescriptionInput.addEventListener('click', textEditor(foodDescriptionInput));
  // descriptionRelationCell.addEventListener('click', textEditor(descriptionRelationCell));
  
  //foodTable.appendChild(addRowButton);

  // Adding Buttons to the table
  const actionCell = document.createElement('td'); // new column
  const editButton = document.createElement('i'); // new Edit button
  // editButton.textContent = 'Edit'; // button text
  editButton.classList.add('edit-button'); // add class to the button
  editButton.addEventListener('click', () => toggleEditMode(row)); // add event listener to the button
  // Another button
  const saveButton = document.createElement('i'); // new Save button
  saveButton.textContent = 'Save'; // button text
  saveButton.classList.add('save-button'); // add class to the button
  saveButton.addEventListener('click', () => saveRelationRow(row));  // add event listener to the button
  saveButton.style.display = 'none'; // Hide Save button by default
  actionCell.appendChild(editButton); // Add Edit button to the action cell
  actionCell.appendChild(saveButton);  // Add Save button to the action cell

  // Creating a row with inputs and buttons
  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(foodDescriptionCell);
  row.appendChild(formFoodCell);
  row.appendChild(formAmountCell);
  row.appendChild(descriptionRelationCell);  // adding description relation to the row
  row.appendChild(actionCell);
  
  return row;
}

function textEditor(descriptionInput) {  // function to add text editor to the description field{
  const expandedTextField = document.createElement('textarea');
  expandedTextField.classList.add('expanded-text-field');
  expandedTextField.value = descriptionInput.value;
  expandedTextField.placeholder = 'Type description here...';

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  document.body.appendChild(expandedTextField);
  document.body.appendChild(overlay);

  expandedTextField.focus();

   overlay.addEventListener('click', () => {
    descriptionInput.value = expandedTextField.value;
    document.body.removeChild(expandedTextField);
    document.body.removeChild(overlay);
  });
};

async function saveRelationRow(row) {
  let rowIndex = findRowIndex(row);
  console.log('SAVE ROW - ' + rowIndex);
  const editableInputs = row.querySelectorAll('.editable');

  // =========== RELATION DATA ===============
  const relationData = {
    // id: 0,
    forms: editableInputs[2],
    amount: editableInputs[3].value,
    description: editableInputs[4].value,
    food: row.querySelector('.id-input').value,
    nutrient: nutrient.id,
  };
  // ============== FOOD DATA ==================
  const foodData = {
    // id: 0,
    foodName: editableInputs[0].value,
    description: editableInputs[1].value,
    // foodNutrientRelations: [relationData]
  };
  // ========== ACTIVE FORMS DATA ==============
  const formData = {
    id: 0,
    formName: editableInputs[2].value,
    description: '',
    nutrientId: nutrient.id
  }

  let foodFormId = row.querySelector('.id-input').value; // insert Form ID (same as in the form object
  console.log('Current form ID = ' + foodFormId);

  let responseRelationSave, responseFoodSave, responseFormSave;

  // Changing form name to ID for patcing realation
  responseFormSave = await fetchAPI(forms + byName + editableInputs[2].value)
  relationData.forms = responseFormSave.id; // replacing name with ID

  if (foodFormId == '0') { // create or create food
    console.log(JSON.stringify(foodData));
    responseFoodSave = await fetchAPI(food + create, post, foodData); // save food

    relationData.food = responseFoodSave.id; // reading new food ID
    foodSources[rowIndex] = responseFoodSave;

    responseRelationSave = await fetchAPI(relations + create, post, relationData); // save relation
    foodNutrientRelations[rowIndex] = responseRelationSave; // update relation
    
    foodFormId = responseFoodSave.id; // update Form ID
  } else {
    foodData.id = foodFormId; // only for patching // read current food ID

    responseFoodSave = await fetchAPI // updating food data
      (food + foodFormId, patch, foodData);
    
      relationData.id = foodNutrientRelations[rowIndex].id; // read relation ID
      responseRelationSave = await fetchAPI // updating relation data
      (relations + relationData.id, patch, relationData);
  }

  if (responseFoodSave.foodName == foodData.foodName) { 
    console.log('Data updated successfully');
    createCheckmark(row);
  }
  editableInputs.forEach((input) => {
    input.disabled = true;
    input.classList.remove('active');
  });
  editSaveBtn(row); // replacing buttons

  console.log('Saved data:', JSON.stringify(relationData));

}

// Adding a first row to the table
async function addFooodRelationsByNutrient(nutrient) {

  let responseRelationsData = await fetchAPI(relations + 'byNutrient/' + nutrient.id);
  console.log('number of Relations for ' + nutrient.name + ' - ' + responseRelationsData.length); 

  

  for (let i = 0; i < responseRelationsData.length; i++) {
    foodNutrientRelations[i] = responseRelationsData[i]; // filling Active Forms array with received data

    let responseFoodData = await fetchAPI(food + foodNutrientRelations[i].food); // fetching food data
    foodSources[i] = responseFoodData; // filling Active Forms array with received data
    
    let responseFormData = await fetchAPI(forms + foodNutrientRelations[i].forms); // fetching
    activeForms[i] = responseFormData;
    activeForm.formName = responseFormData.formName;// filling Active Forms array with received data

    foodTable.getElementsByTagName('tbody')[0]
      .appendChild(creatingFoodRow(foodSources[i], activeForms[i], foodNutrientRelations[i]));
    }

}

// ====================== NEW INTERACTION LINE IN TABLE =========================
function creatingInteractionRow(interactionObject = nutrientsInteraction, firstNutrient = '', secondNutrient = '') {
  const row = document.createElement('tr');

  console.log('Building row - ' + interactionObject.id + ' - ' + firstNutrient +' - '+ secondNutrient + '-'+ interactionObject.interaction);

  const idCell = document.createElement('td');
  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.value = interactionObject.id; // insert Active Form ID
  idInput.classList.add('id-input');
  idInput.disabled = true; // inactive by default
  idCell.appendChild(idInput);

  const firstNutrientCell = document.createElement('td');
  const firstNutrientNameInput = document.createElement('input');
  firstNutrientNameInput.type = 'text';
  firstNutrientNameInput.value = firstNutrient; // insert Active Form name
  firstNutrientNameInput.classList.add('editable', 'first-nutrient-input');
  firstNutrientNameInput.disabled = true; // inactive by default
  firstNutrientCell.appendChild(firstNutrientNameInput);

  const secondNutrientCell = document.createElement('td');
  const secondNutrientNameInput = document.createElement('input');
  secondNutrientNameInput.type = 'text';
  secondNutrientNameInput.value = secondNutrient; // insert Active Form name
  secondNutrientNameInput.classList.add('editable', 'second-nutrient-input');
  secondNutrientNameInput.disabled = true; // inactive by default
  secondNutrientCell.appendChild(secondNutrientNameInput);

  const interactionCell = document.createElement('td');
  const interactionInput = document.createElement('input');
  interactionInput.type = 'text';
  interactionInput.value = interactionObject.interaction; // insert Active Form name
  interactionInput.classList.add('editable', 'interaction-input');
  interactionInput.disabled = true; // inactive by default
  interactionCell.appendChild(interactionInput);

  // Adding Buttons to the table
  const actionCell = document.createElement('td'); // new column
  const editButton = document.createElement('i'); // new Edit button
  // editButton.textContent = 'Edit'; // button text
  editButton.classList.add('edit-button'); // add class to the button
  editButton.addEventListener('click', () => toggleEditMode(row)); // add event listener to the button
  // Save button
  const saveButton = document.createElement('i'); // new Save button
  saveButton.textContent = 'Save'; // button text
  saveButton.classList.add('save-button'); // add class to the button
  saveButton.addEventListener('click', () => saveInteraction(row));  // add event listener to the button
  saveButton.style.display = 'none'; // Hide Save button by default
  // Delete button
  const deleteButton = document.createElement('i'); // new Save button
  deleteButton.textContent = 'Delete'; // button text
  deleteButton.classList.add('delete-button'); // add class to the button
  deleteButton.addEventListener('click', () => deleteInteraction(row));  // add event listener to the button

  actionCell.appendChild(editButton); // Add Edit button to the action cell
  actionCell.appendChild(saveButton);  // Add Save button to the action cell
  actionCell.appendChild(deleteButton);  // Add Delete button to the action cell

  // Creating a row with inputs and buttons
  row.appendChild(idCell);
  row.appendChild(firstNutrientCell);
  row.appendChild(secondNutrientCell);
  row.appendChild(interactionCell);
  row.appendChild(actionCell);
  idInput.value = interactionObject.id; // insert Active Form ID

  return row;
}

// Function for SAVE button
async function saveInteraction(row) {
  let formId = row.querySelector('.id-input').value; // insert Interaction ID (same as in the form object
  console.log('SAVE ROW - ' + formId);
  let editableInputs = row.querySelectorAll('.editable');
  let firstNutrient = await findNutrientByName(editableInputs[0].value); // fetching first nutrient data
  let secondNutrient = await findNutrientByName(editableInputs[1].value); // fetching second nutrient data
  let data = {
    firstNutrient: firstNutrient.id,
    secondNutrient: secondNutrient.id,
    interaction: editableInputs[2].value // insert Nutrient ID (same as in the nutrient object)
  };

  let responseSave;
  if (formId == '0') {
    responseSave = await fetchAPI(interactions + create, post, data);
    formId.value = responseSave.id; // update Form ID
  } else {
    data.id = formId; // only for patching
    responseSave = await fetchAPI
      (interactions + formId, patch, data);
  }

  if (responseSave.interaction == data.interaction) { 
    console.log('Data updated successfully');
    createCheckmark(row);
  }
  editableInputs.forEach((input) => {
    input.disabled = true;
    input.classList.remove('active');
  });
  editSaveBtn(row); // replacing buttons

  console.log('Saved data:', data);
}

// Adding a first row to the table
async function addInteractionsByNutrient(nutrient) {

  let responseData = await fetchAPI(interactions + 'byNutrient/' + nutrient.id);
  console.log('number of interactions - ' + responseData.length); 

  for (let i = 0; i < responseData.length; i++) {
    nutrientsInteractions[i] = responseData[i]; // filling Active Forms array with received data
    let firstNutrient = await findNutrientById(nutrientsInteractions[i].firstNutrient);
    let secondNutrient = await findNutrientById(nutrientsInteractions[i].secondNutrient);
    console.log('!!! Interactions - ' + nutrientsInteractions[i].id + ' - ' + firstNutrient.name + ' - ' + secondNutrient.name + '-' + nutrientsInteractions[i].interaction);
    
    let row = creatingInteractionRow(nutrientsInteractions[i], firstNutrient.name, secondNutrient.name);
    console.log(row);
    
    interactionTable.getElementsByTagName('tbody')[0].appendChild(row);
  }
}

async function findNutrientByName(name = nutrient.name) {
  let responseMineral = await fetchAPI(minerals + byName + name);
    if (responseMineral.id) { 
      return responseMineral;
    } else if (responseVitamin.id) {
      let responseVitamin = await fetchAPI(minerals + byName + name);
      return responseVitamin;
    } else {
    return 'No nutrient found by name ' + name;
    } 
}

async function findNutrientById(id = nutrient.id) {
  let responseMineral = await fetchAPI(minerals + id);
    if (responseMineral.id) { 
      return responseMineral;
    } else if (responseVitamin.id) {
      let responseVitamin = await fetchAPI(minerals + id);
      return responseVitamin;
    } else {
    return 'No nutrient found by id ' + id;
    }
}

export function fetchServer(url = '', method = 'GET', data = null, headers = {}) { 
  return fetchAPI(url, method, data, headers);
  
}