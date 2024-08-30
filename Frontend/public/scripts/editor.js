import {
  minerals, vitamins, aminoacids,
  byName, byNutrint, byId,
  nutrientName,
  fetchAPI, host,
  forms, token,
  relations,
  interactions,
  food, deleteRow,
  patch, post, delets, search, create,
  LoadHeader, LoadFooter,
  url, activeForm, foodSource, nutrientsInteraction, foodNutrientRelation,
  activeForms, nutrientsInteractions, foodNutrientRelations, foodSources
} from "./utils.js";

// SERVICE PART
var nutrientId = 0;
var rda;
var nutrientObject = [];
let nutrientType = url.split("/")[1] + '/';

const nutrientTable = document.getElementById("nutrient-table");
var tbodyNutrient;

try {
  tbodyNutrient = nutrientTable.getElementsByTagName('tbody')[0];
} catch (error) { 
  console.error('Error getting table element: tbody', error);
}

const formTable = document.getElementById('form-table');
// const tbodyForm = formTable.getElementsByTagName('tbody')[0];

const foodTable = document.getElementById('food-table');
// const tbodyFood = formTable.getElementsByTagName('tbody')[0];

const interactionTable = document.getElementById('interaction-table');

// LOADING CONTENT

nutrientObject = await loadingNutrient();          // FETCHING NUTRIENT DATA
console.log(nutrientObject);
setupPage();
const nutrientRow = loadNutrientTable();

addFormsByNutrient();             // Initializing table with Active Forms
addFooodRelationsByNutrient();    // Initializing table with Food Sources
addInteractionsByNutrient()       // Initializing table with Interactions
addNewBtn(formTable, activeForm, creatingFormRow); // Adding a "+" button
addNewBtn(foodTable, foodSource, creatingFoodRow); // Adding a "+" button
addNewBtn(interactionTable, nutrientsInteraction, creatingInteractionRow); // Adding a "+" button


async function loadingNutrient() {
  // Insert the header HTML at the beginning of the body
  let responseData = await fetchAPI(nutrientType + `${nutrientName}`);

  nutrientId =  responseData.id; // Nutrient ID from the API response
  rda =  responseData.rda;       // RDA from the API response

  return responseData;
}

function addNewBtn(table ,object, functionName) {  
  let addRowButton = document.createElement('span');
  addRowButton.className = 'add-row';
  addRowButton.style.position = "relative";
  addRowButton.style.left = "15%";
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
  nameCell.style.width = '32%';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = activeFormObject.formName; // insert Active Form name
  nameInput.classList.add('editable', 'formName-input');
  nameInput.disabled = true; // inactive by default
  nameCell.appendChild(nameInput);

  const descriptionCell = document.createElement('td');
  descriptionCell.style.width = '60%';
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
  overlay.classList.add('overlay-text');

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
  actionCell.style.width = '10%';
  actionCell.style.height = '42px';
  actionCell.style.display = 'flex';
  actionCell.style.flexDirection = 'row';
  actionCell.style.alignItems = 'center';
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

    // Delete button
  const deleteButton = document.createElement('i'); // add Delete button
  deleteButton.textContent = 'Delete'; // button text
  deleteButton.classList.add('delete-button'); // add class to the button
  deleteButton.addEventListener('click', () => deleteRow(row, forms, activeFormObject.id));  // add event listener to the button
  actionCell.appendChild(deleteButton);  // Add Delete button to the action cell

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
    nutrientId: nutrientObject.id, // insert Nutrient ID (same as in the nutrient object)
  };

  let responseSave;
  if (formId == '0') {
    responseSave = await fetchAPI(forms + create, post, data, token);
    formId.value = responseSave.id; // update Form ID
  } else {
    data.id = formId; // only for patching
    responseSave = await fetchAPI
      (forms + formId, patch, data, token);
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
async function addFormsByNutrient() {

  let responseData = await fetchAPI(forms + 'byNutrient/' + nutrientObject.id);
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
    nutrientId: nutrientObject.id
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
  foodDescriptionInput.addEventListener('click', () => {
  const expandedTextField = document.createElement('textarea');
  expandedTextField.classList.add('expanded-text-field');
  expandedTextField.value = descriptionInput.value;
  expandedTextField.placeholder = 'Type description here...';

  const overlay = document.createElement('div');
  overlay.classList.add('overlay-text');

  document.body.appendChild(expandedTextField);
  document.body.appendChild(overlay);

  expandedTextField.focus();

   overlay.addEventListener('click', () => {
    foodDescriptionInput.value = expandedTextField.value;
    document.body.removeChild(expandedTextField);
    document.body.removeChild(overlay);
    });
  });

  // Adding Buttons to the table
  const actionCell = document.createElement('td'); // new column
  actionCell.style.width = '10%';
  actionCell.style.height = '42px';
  actionCell.style.display = 'flex';
  actionCell.style.flexDirection = 'row';
  actionCell.style.alignItems = 'center';
  const editButton = document.createElement('i'); // new Edit button
  // editButton.textContent = 'Edit'; // button text
  editButton.classList.add('edit-button'); // add class to the button
  editButton.addEventListener('click', () => toggleEditMode(row)); // add event listener to the button
  // Another button
  const saveButton = document.createElement('i'); // new Save button
  saveButton.textContent = 'Save'; // button text
  saveButton.classList.add('save-button'); // add class to the button
  saveButton.addEventListener('click', () => saveRelationRow(row,));  // add event listener to the button
  saveButton.style.display = 'none'; // Hide Save button by default
  actionCell.appendChild(editButton); // Add Edit button to the action cell
  actionCell.appendChild(saveButton);  // Add Save button to the action cell
    // Delete button
  const deleteButton = document.createElement('i'); // add Delete button
  deleteButton.textContent = 'Delete'; // button text
  deleteButton.classList.add('delete-button'); // add class to the button
  deleteButton.addEventListener('click', () => deleteRow(row, food, activeFoodObject.id));  // add event listener to the button
  actionCell.appendChild(deleteButton);  // Add Delete button to the action cell

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
  overlay.classList.add('overlay-text');

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
    nutrient: nutrientObject.id,
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
    nutrientId: nutrientObject.id
  }

  let foodFormId = row.querySelector('.id-input').value; // insert Form ID (same as in the form object
  console.log('Current form ID = ' + foodFormId);

  let responseRelationSave, responseFoodSave, responseFormSave;

  // Changing form name to ID for patcing realation
  responseFormSave = await fetchAPI(forms + byName + editableInputs[2].value)
  relationData.forms = responseFormSave.id; // replacing name with ID

  if (foodFormId == '0') { // create or create food
    console.log(JSON.stringify(foodData));
    responseFoodSave = await fetchAPI(food + create, post, foodData, token); // save food

    relationData.food = responseFoodSave.id; // reading new food ID
    foodSources[rowIndex] = responseFoodSave;

    responseRelationSave = await fetchAPI(relations + create, post, relationData, token); // save relation
    foodNutrientRelations[rowIndex] = responseRelationSave; // update relation
    
    foodFormId = responseFoodSave.id; // update Form ID
  } else {
    foodData.id = foodFormId; // only for patching // read current food ID

    responseFoodSave = await fetchAPI // updating food data
      (food + foodFormId, patch, foodData, token);
    
      relationData.id = foodNutrientRelations[rowIndex].id; // read relation ID
      responseRelationSave = await fetchAPI // updating relation data
      (relations + relationData.id, patch, relationData, token);
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
async function addFooodRelationsByNutrient() {

  let responseRelationsData = await fetchAPI(relations + 'byNutrient/' + nutrientObject.id);
  console.log('number of Relations for ' + nutrientObject.name + ' - ' + responseRelationsData.length); 

  

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

  //console.log('Building row - ' + interactionObject.id + ' - ' + firstNutrient +' - '+ secondNutrient + '-'+ interactionObject.interaction);

  const idCell = document.createElement('td');
  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.value = interactionObject.id; // insert Active Form ID
  idInput.classList.add('id-input');
  idInput.disabled = true; // inactive by default
  idCell.appendChild(idInput);

  const firstNutrientCell = document.createElement('td');
  firstNutrientCell.style.width = '20%';
  const firstNutrientNameInput = document.createElement('input');
  firstNutrientNameInput.type = 'text';
  firstNutrientNameInput.value = firstNutrient; // insert Active Form name
  firstNutrientNameInput.classList.add('editable', 'first-nutrient-input');
  firstNutrientNameInput.disabled = true; // inactive by default
  firstNutrientCell.appendChild(firstNutrientNameInput);

  const secondNutrientCell = document.createElement('td');
  secondNutrientCell.style.width = '20%';
  const secondNutrientNameInput = document.createElement('input');
  secondNutrientNameInput.type = 'text';
  secondNutrientNameInput.value = secondNutrient; // insert Active Form name
  secondNutrientNameInput.classList.add('editable', 'second-nutrient-input');
  secondNutrientNameInput.disabled = true; // inactive by default
  secondNutrientCell.appendChild(secondNutrientNameInput);

  const interactionCell = document.createElement('td');
  interactionCell.style.width = '50%';
  const interactionInput = document.createElement('input');
  interactionInput.type = 'text';
  interactionInput.value = interactionObject.interaction; // insert Active Form name
  interactionInput.classList.add('editable', 'interaction-input');
  interactionInput.disabled = true; // inactive by default
  interactionCell.appendChild(interactionInput);

  // Adding Buttons to the table
  const actionCell = document.createElement('td'); // new column
  actionCell.style.width = '10%';
  actionCell.style.height = '42px';
  actionCell.style.display = 'flex';
  actionCell.style.flexDirection = 'row';
  actionCell.style.alignItems = 'center';
  const editButton = document.createElement('i'); // new Edit button
  // editButton.textContent = 'Edit'; // button text
  editButton.classList.add('edit-button'); // add class to the button
  editButton.addEventListener('click', () => toggleEditMode(row)); // add event listener to the button
  actionCell.appendChild(editButton); // Add Edit button to the action cell
  // Save button
  const saveButton = document.createElement('i'); // add Save button
  saveButton.textContent = 'Save'; // button text
  saveButton.classList.add('save-button'); // add class to the button
  saveButton.addEventListener('click', () => saveInteraction(row));  // add event listener to the button
  saveButton.style.display = 'none'; // Hide Save button by default
  actionCell.appendChild(saveButton);  // Add Save button to the action cell
  // Delete button
  const deleteButton = document.createElement('i'); // add Delete button
  deleteButton.textContent = 'Delete'; // button text
  deleteButton.classList.add('delete-button'); // add class to the button
  deleteButton.addEventListener('click', () => deleteRow(row));  // add event listener to the button
  actionCell.appendChild(deleteButton);  // Add Delete button to the action cell

  // TEXT EDITOR
  interactionInput.addEventListener('click', () => {
  const expandedTextField = document.createElement('textarea');
  expandedTextField.classList.add('expanded-text-field');
  expandedTextField.value = interactionInput.value;
  expandedTextField.placeholder = 'Type description here...';

  const overlay = document.createElement('div');
  overlay.classList.add('overlay-text');

  document.body.appendChild(expandedTextField);
  document.body.appendChild(overlay);

  expandedTextField.focus();

   overlay.addEventListener('click', () => {
    interactionInput.value = expandedTextField.value;
    document.body.removeChild(expandedTextField);
    document.body.removeChild(overlay);
    });
  });
  

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
  let interactionId = row.querySelector('.id-input').value; // insert Interaction ID (same as in the form object
  console.log('SAVE ROW - ' + interactionId);
  let editableInputs = row.querySelectorAll('.editable');
  // TODO: optimize for fetching by ID instead of name
  let firstNutrient = await findNutrientByName(editableInputs[0].value); // fetching first nutrient data
  let secondNutrient = await findNutrientByName(editableInputs[1].value); // fetching second nutrient data
  let data = {
    id: interactionId, // insert Interaction ID (same as in the form object)
    firstNutrient: firstNutrient.id,
    secondNutrient: secondNutrient.id,
    interaction: editableInputs[2].value // insert Nutrient ID (same as in the nutrient object)
  };

  let responseSave;
  if (interactionId == '0') {
    responseSave = await fetchAPI(interactions + create, post, data, token);
    interactionId.value = responseSave.id; // update Form ID
  } else {
    responseSave = await fetchAPI
      (interactions + interactionId, patch, data, token);
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
async function addInteractionsByNutrient() {

  let responseData = await fetchAPI(interactions + 'byNutrient/' + nutrientObject.id);
  console.log('number of interactions - ' + responseData.length);
  let firstNutrient = [];
  let secondNutrient = [];

  for (let i = 0; i < responseData.length; i++) {

    if (responseData[i].firstNutrient == nutrientObject.id) {
      firstNutrient = nutrientObject;
      secondNutrient = await findNutrientById(responseData[i].secondNutrient);
    } else { 
      firstNutrient = await findNutrientById(responseData[i].firstNutrient);
      secondNutrient = nutrientObject;
    }
     
    
    // console.log(secondNutrient);
    //console.log('!!! Interactions - ' + responseData[i].id + ' - ' + firstNutrient.name + ' - ' + secondNutrient.name + '-' + nutrientsInteractions[i].interaction);
    
    let row = creatingInteractionRow(responseData[i], firstNutrient.name, secondNutrient.name);
    
    interactionTable.getElementsByTagName('tbody')[0].appendChild(row);
  }
}

async function findNutrientByName(name = nutrientObject.name) {
  return await fetchAPI(search + byName + name);  
  
  /*  let responseMineral = await fetchAPI(minerals + byName + name);
    if (responseMineral.id) { 
      return responseMineral;
    } else if (responseVitamin.id) {
      let responseVitamin = await fetchAPI(vitamins + byName + name);
      return responseVitamin;
    } else {
    return 'No nutrient found by name ' + name;
    }  */
}

async function findNutrientById(id) {
/*   let responseMineral = await fetchAPI(minerals + id);
    if (responseMineral.id) { 
      return responseMineral;
    } else if (responseVitamin.id) {
      let responseVitamin = await fetchAPI(vitamins + id);
      return responseVitamin;
    } else {
    return 'No nutrient found by id ' + id;
    } */
  return await fetchAPI(search + byId + id);
}

function setupPage() { 
  document.getElementById('nutrient-header').innerHTML = 'Nutrient Editor - ' + nutrientObject.name;
  document.getElementById('nutrient-image').src = nutrientObject.image;
  addNewNutrientForm();
  addNewActiveForm();
  document.getElementById('add-new').addEventListener('click', () => activateAddNutrient());
  document.getElementById('add-new-form').addEventListener('click', () => activateAddActiveForm());
}


async function loadNutrientTable() {
  const nutrientRowHTML = `
    <tr id='nutrient-row'>
      <td>
        <input class='id-input' disabled='true' type="text"
        value='${nutrientObject.id}'>
        </input>
      </td>
      <td>
        <input class='editable nutrientName-input' disabled='true' type="text"
          value='${nutrientObject.name}'>
        </input>
      </td>
          <td>
        <input class='editable nutrientFullName-input' disabled='true' type="text"
          value='${nutrientObject.fullName}'>
        </input>
      </td>
          <td>
        <input class='editable rda-input' disabled='true' type="text"
          value='${nutrientObject.rda}'>
        </input>
      </td>
          <td>
        <input class='editable shortDescription-input' disabled='true' type="text"
          value='${nutrientObject.shortDescription}'>
        </input>
      </td>
          <td>
        <input class='editable image-input' disabled='true' type="text"
          value='${nutrientObject.image}'>
        </input>
      </td>
    </tr>
`;
  tbodyNutrient.insertAdjacentHTML("afterbegin", nutrientRowHTML);
  
  // TEXT EDITOR
  const shortDescriptionInput = document.querySelector('.shortDescription-input');
  shortDescriptionInput.addEventListener('click', () => {
    const expandedTextField = document.createElement('textarea');
    expandedTextField.classList.add('expanded-text-field');
    expandedTextField.value = shortDescriptionInput.value;
    expandedTextField.placeholder = 'Type description here...';

    const overlay = document.createElement('div');
    overlay.classList.add('overlay-text');

    document.body.appendChild(expandedTextField);
    document.body.appendChild(overlay);

    expandedTextField.focus();

    overlay.addEventListener('click', () => {
      shortDescriptionInput.value = expandedTextField.value;
      document.body.removeChild(expandedTextField);
      document.body.removeChild(overlay);
      });
  });
  let nutrientRow = document.getElementById('nutrient-row')
  // Adding Buttons to the table
  const actionCell = document.createElement('td'); // new column
  actionCell.style.width = '10%';
  actionCell.style.height = '42px';
  actionCell.style.display = 'flex';
  actionCell.style.flexDirection = 'row';
  actionCell.style.alignItems = 'center';
  const editButton = document.createElement('i'); // new Edit button
  // editButton.textContent = 'Edit'; // button text
  editButton.classList.add('edit-button'); // add class to the button
  editButton.addEventListener('click', () => toggleEditMode(nutrientRow)); // add event listener to the button
  // Save button
  const saveButton = document.createElement('i'); // add Save button
  saveButton.textContent = 'Save'; // button text
  saveButton.classList.add('save-button'); // add class to the button
  saveButton.addEventListener('click', () => saveNutrient(nutrientRow));  // add event listener to the button
  saveButton.style.display = 'none'; // Hide Save button by default
  // Delete button
  const deleteButton = document.createElement('i'); // add Delete button
  deleteButton.textContent = 'Delete'; // button text
  deleteButton.classList.add('delete-button'); // add class to the button
  deleteButton.addEventListener('click', () => deleteRow(nutrientRow));  // add event listener to the button

  actionCell.appendChild(editButton); // Add Edit button to the action cell
  actionCell.appendChild(saveButton);  // Add Save button to the action cell
  actionCell.appendChild(deleteButton);  // Add Delete button to the action cell
  nutrientRow.appendChild(actionCell);
  return nutrientRow;
}
 
async function saveNutrient(row) {
  let formId = row.querySelector('.id-input').value; // insert Form ID (same as in the form object
  console.log('SAVE ROW - ' + formId);
  let editableInputs = row.querySelectorAll('.editable');
  let data = {
    id: nutrientObject.id,
    name: editableInputs[0].value,
    fullName: editableInputs[1].value,
    rda: editableInputs[2].value,
    shortDescription: editableInputs[3].value,
    image: editableInputs[4].value    
  };

  let responseSave;
  if (formId == '0') {
    responseSave = await fetchAPI(nutrientType + create, post, data, token);
    formId.value = responseSave.id; // update Form ID
  } else {
    data.id = formId; // only for patching
    responseSave = await fetchAPI
      (nutrientType + formId, patch, data, token);
  }

  if (responseSave.name == data.name) { 
    console.log('Nutrient Data updated successfully');
    nutrientObject = responseSave;
    createCheckmark(row);
  }
  editableInputs.forEach((input) => {
    input.disabled = true;
    input.classList.remove('active');
  });
  editSaveBtn(row); // replacing buttons
}

    async function addNewNutrientForm() {
      // CREATE MODAL OVERLAY
      const overlay = document.createElement("div");
      overlay.classList.add("modal-overlay");
      document.body.appendChild(overlay);
  
      // CREATE MODAL CONTENT
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
  
      // ADD CLOSE BUTTON
      const closeButton = document.createElement("span");
      closeButton.classList.add("close-button");
      closeButton.textContent = "×";
  
      // ADD FORM
      const addNutrientFormHTML = `
        <h3>Add Nutrient</h3>
        <form id="api-form">
          <label for="optional">Nutrient Type:</label>
          <select id="optional" name="optional">
            <option value="minerals">Minerals</option>
            <option value="vitamins">Vitamins</option>
            <option value="aminos">Amino Acids</option>
          </select>
          <label for="name">Nutrient Name:</label>
          <input type="text" id="name" name="name" required>
          <label for="fullName">Nutrient Full Name:</label>
          <input type="text" id="fullName" name="fullName" required>
          <label for="rda">Nutrient Dosage:</label>
          <input type="text" id="rda" name="rda">
          <label for="image">Upload Image:</label>
          <input type="file" id="image" name="image" accept="image/*">
          <button id="submit" type="submit">Create</button>
        </form>
        <div id="success-message"></div>
      `;
      modalContent.innerHTML = addNutrientFormHTML;
      modalContent.appendChild(closeButton);
      overlay.appendChild(modalContent);
  
      // FORM SUBMIT
      const form = modalContent.querySelector("#api-form");
      const successMessage = modalContent.querySelector("#success-message");
  
      form.addEventListener("submit", async (event) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          const optionalNutrientType = formData.get("optional");
          const imageFile = formData.get("image");
  
          let imagePath = '';
          if (imageFile) {
              try {
                imagePath = await uploadImage(imageFile, optionalNutrientType);
                console.log('Image uploaded successfully:', imagePath);
              } catch (error) {
                  successMessage.textContent = 'Failed to upload image.';
                  return;
              }
          }
  
          const requestData = {
              name: formData.get("name"),
              fullName: formData.get("fullName"),
              rda: formData.get("rda"),
              nutrientType: optionalNutrientType,
              image: imagePath
          };
          console.log('Request data:', requestData);
          try {
              const responseData = await fetchAPI(
                  `${optionalNutrientType}/create`,
                  'POST',
                  requestData,
                  token
              );
  
              if (responseData.name === requestData.name &&
                  responseData.fullName === requestData.fullName &&
                  responseData.rda === requestData.rda) {
                  const id = responseData.id;
                  successMessage.textContent = `Created successfully, ID: ${id}`; 
                  setTimeout(() => {
                      window.location.href = `${host}${optionalNutrientType}/edit/${id}`;
                  }, 3000); // 3 second delay
              }
          } catch (error) {
              successMessage.textContent = 'Failed to create nutrient.';
          }
      });
  
      // CLOSE MODAL
      closeButton.addEventListener("click", () => {
        // overlay.remove();
        overlay.classList.toggle('active');
      });
  }
  
function activateAddNutrient() { 
  document.querySelector('.modal-overlay').classList.toggle('active');
}

async function uploadImage(file, nutrientType) {
  const formData = new FormData();
  formData.append('image', file);

  try {
      const response = await fetch(`/upload-image/${nutrientType}`, {
          method: 'POST',
          body: formData
      });

      if (!response.ok) {
          throw new Error('Failed to upload image');
      }

      const result = await response.json();
      return result.imagePath; // Возвращаем путь к загруженному изображению
  } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
  }
}
function activateAddActiveForm() { 
  document.querySelector('.modal-form-overlay').classList.toggle('active');
}



// ADD NEW FORM

async function addNewActiveForm() {
  // CREATE MODAL OVERLAY
  const formOverlay = document.createElement("div");
  formOverlay.classList.add("modal-form-overlay");
  document.body.appendChild(formOverlay);

  // CREATE MODAL CONTENT
  const modalFormContent = document.createElement("div");
  modalFormContent.classList.add("modal-form-content");

  // ADD CLOSE BUTTON
  const closeButton = document.createElement("span");
  closeButton.classList.add("close-form-button");
  closeButton.textContent = "×";

  // ADD FORM
  const addActiveFormHTML = `
    <h3>Add Active Form to Nutrient</h3>
    <form id="api-form">
      <label for="name">Active Form Name:</label>
      <input type="text" id="name" name="name" required>
      <label for="description">Active Form Description:</label>
      <input type="text" id="descrption" name="description" required>
      <button id="submit" type="submit">Create</button>
    </form>
    <div id="success-message"></div>
  `;
  modalFormContent.innerHTML = addActiveFormHTML;
  modalFormContent.appendChild(closeButton);
  formOverlay.appendChild(modalFormContent);

  // FORM SUBMIT
  const form = modalFormContent.querySelector("#api-form");
  const successMessage = modalFormContent.querySelector("#success-message");

  form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);

      const requestData = {
          formName: formData.get("name"),
          description: formData.get("description"),
          nutrientId: nutrientObject.id,
      };
      console.log('Request data:', requestData);
      try {
          const responseData = await fetchAPI(
              `activeForms/create`,
              'POST',
              requestData,
              token
          );

          if (responseData.formName === requestData.formName) {
              const formId = responseData.id;
              successMessage.textContent = `Created successfully, ID: ${formId}`; 
          }
      } catch (error) {
          successMessage.textContent = 'Failed to create Active Form.';
      }
  });

  // CLOSE MODAL
  closeButton.addEventListener("click", () => {
    // overlay.remove();
    formOverlay.classList.toggle('active');
  });
}


