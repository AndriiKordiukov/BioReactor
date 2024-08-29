import {
  minerals, vitamins, aminoacids,
  byName, byNutrint, byId,
  url, fetchAPI, host,
  forms, token,
  relations,
  interactions, nutrientsArray,
  food,
  patch, post, delets, search, create,
  LoadHeader, LoadFooter, deleteRow,
  activeForm, foodSource, nutrientsInteraction, foodNutrientRelation,
  activeForms, nutrientsInteractions, foodNutrientRelations, foodSources
} from "./utils.js";

// SERVICE PART
const foodId = url.split("/").pop();

const foodTable = document.getElementById('food-table');
// const tbodyFood = formTable.getElementsByTagName('tbody')[0];
const tbodyFood = foodTable.getElementsByTagName('tbody')[0];

const nutrientTable = document.getElementById("nutrient-table");

const successMessage = document.getElementById("success-message");
const form = document.getElementById("api-form");

// LOADING CONTENT
const foodObject = await loadingFood();          // FETCHING NUTRIENT DATA
console.log(foodObject);
setupPage();
const foodRow = await loadFoodTable();

addFooodRelationsByFood();    // Initializing table with Food Sources

// addNewBtn(foodTable, foodObject, creatingFoodRow); // Adding a "+" button
addNewBtn(nutrientTable, foodNutrientRelation, creatingNutrientRow); // Adding a "+" button


async function loadingFood() {
  return await fetchAPI(food + `${foodId}`);
}

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
    nutrientId: row.getElementById('id-input').id, // insert Nutrient ID (same as in the nutrient object)
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
async function addFormsByNutrient() {

  let responseData = await fetchAPI(forms + 'byNutrient/' + foodObject.id);
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


function setupPage() { 
  document.getElementById('food-header').innerHTML = 'Food Editor - ' + foodObject.foodName;
  document.getElementById('food-image').src = foodObject.image;
  addNewFoodForm();
  document.getElementById('add-new').addEventListener('click', () => activateAddForm());
}

function creatingNutrientRow(nutrientObject = nutrient, formObject = activeForm, relationObject = foodNutrientRelation) {
  const row = document.createElement('tr');

  const idCell = document.createElement('td');
  const idInput = document.createElement('input');
  idInput.type = 'text';
  idInput.value = nutrientObject.id;
  idInput.classList.add('id-input');
  idInput.disabled = true; // inactive by default
  idCell.appendChild(idInput);

  const nameCell = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = nutrientObject.name; // insert Active Form name
  nameInput.classList.add('editable', 'nutrientName-input');
  nameInput.disabled = true; // inactive by default
  nameCell.appendChild(nameInput);

  const fullNameCell = document.createElement('td');
  const fullNameInput = document.createElement('input');
  fullNameInput.type = 'text';
  fullNameInput.value = nutrientObject.fullName; // insert Active Form name
  fullNameInput.classList.add('editable', 'nutrientFullName-input');
  fullNameInput.disabled = true; // inactive by default
  fullNameCell.appendChild(fullNameInput);

  const formCell = document.createElement('td');
  const formInput = document.createElement('input');
  formInput.type = 'text';
  console.log(formObject.formName);
  formInput.value = formObject.formName; // insert Active Form name
  formInput.classList.add('editable', 'formName-input');
  formInput.disabled = true; // inactive by default
  formCell.appendChild(formInput);

  const formDescriptionCell = document.createElement('td');
  // formDescriptionCell.style.width = '20%';
  const formDescriptionInput = document.createElement('input');
  formDescriptionInput.type = 'text';
  formDescriptionInput.value = formObject.description; // insert Active Form description
  formDescriptionInput.classList.add('editable', 'formDescription-input');
  formDescriptionInput.disabled = true; // inactive by default
  formDescriptionCell.appendChild(formDescriptionInput);

  const formAmountCell = document.createElement('td');
 
  const formAmountInput = document.createElement('input');
  // formAmountInput.style.width = '100px';
  formAmountInput.type = 'text';
  formAmountInput.value = relationObject.amount; // insert Active Form name
  formAmountInput.classList.add('editable', 'formAmount-input');
  formAmountInput.disabled = true; // inactive by default
  formAmountCell.appendChild(formAmountInput);

  const descriptionRelationCell = document.createElement('td');
  // descriptionRelationCell.style.width = '20%';
  const descriptionRelationInput = document.createElement('input');
  descriptionRelationInput.type = 'text';
  descriptionRelationInput.value = relationObject.description; // insert Active Form description
  descriptionRelationInput.classList.add('editable', 'relationDescription-input');
  descriptionRelationInput.disabled = true; // inactive by default
  descriptionRelationCell.appendChild(descriptionRelationInput);

  const descriptionObjects = [formDescriptionInput, descriptionRelationInput].concat();
  // TEXT EDITOR
  descriptionObjects.forEach(obj => {
    obj.addEventListener('click', () => {
      const expandedTextField = document.createElement('textarea');
      expandedTextField.classList.add('expanded-text-field');
      expandedTextField.value = obj.value;
      expandedTextField.placeholder = 'Type description here...';
    
      const overlay = document.createElement('div');
      overlay.classList.add('overlay-text');
    
      document.body.appendChild(expandedTextField);
      document.body.appendChild(overlay);
    
      expandedTextField.focus();
    
       overlay.addEventListener('click', () => {
        obj.value = expandedTextField.value;
        document.body.removeChild(expandedTextField);
        document.body.removeChild(overlay);
        });
      });
  });
  

  // Adding Buttons to the table
  const actionCell = document.createElement('td'); // new column
  actionCell.style.width = '75px';
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
    // Delete button
  const deleteButton = document.createElement('i'); // add Delete button
  deleteButton.textContent = 'Delete'; // button text
  deleteButton.classList.add('delete-button'); // add class to the button
  deleteButton.addEventListener('click', () => deleteRow(row));  // add event listener to the button
  actionCell.appendChild(deleteButton);  // Add Delete button to the action cell

  // Creating a row with inputs and buttons
  row.appendChild(idCell);
  row.appendChild(nameCell); fullNameCell
  row.appendChild(fullNameCell);
  row.appendChild(formCell);
  row.appendChild(formDescriptionCell);
  row.appendChild(formAmountCell);
  row.appendChild(descriptionRelationCell);  // adding description relation to the row
  row.appendChild(actionCell);
  
  return row;
}

function textEditor(descriptionInput) {  // function to add text editor to the description field{
  const expandedTextField = document.createElement('textarea');
  expandedTextField.classList.add('expanded-text-field');
  expandedTextField.value = descriptionInput.value;
  expandedTextField.placeholder = 'Type-in description here...';

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

async function deleteRelation(row, modal) {
  // DELETING RELATION FROM THE DATABASE
    let rowIndex = findRowIndex(row);
    console.log('Deleting ROW - ' + rowIndex);
    let result = await fetchAPI(relations + foodNutrientRelations[rowIndex].id, delets);
    console.log('Relation with ID -'+ result.id + ' was deleted successfully.');
    row.remove();
}

async function saveRelationRow(row) {
  let rowIndex = findRowIndex(row);
  console.log('SAVE ROW - ' + (rowIndex+1));
  const editableInputs = row.querySelectorAll('.editable');
  let currentNutrientId = row.querySelector('.id-input').value; // insert Form ID (same as in the form object

  // =========== RELATION DATA ===============
  const relationData = {
    // id: 0,
    forms: editableInputs[2],value,
    amount: editableInputs[4].value,
    description: editableInputs[5].value,
    food: foodObject.id,
    nutrient: currentNutrientId
  };
  // ============== NUTRIENT DATA ==================
  const nutrientData = {
    id: currentNutrientId,
    name: editableInputs[0].value,
    fullName: editableInputs[1].value
  };
  // ========== ACTIVE FORMS DATA ==============
  const formData = {
    formName: editableInputs[2].value,
    description: editableInputs[3].value,
    nutrientId: currentNutrientId
  }

  let responseRelationSave, responseNutrientSave, responseFormSave;
  console.log('NUMBER OR NUT? - ' + !isNaN(editableInputs[2].value));
  if (isNaN(editableInputs[2].value)) { 
  // Changing form name to ID for patcing realation
  responseFormSave = await fetchAPI(forms + byName + editableInputs[2].value)
    relationData.forms = responseFormSave.id; // replacing name with ID
  }
  

  if (currentNutrientId == '0') { // create or create food
    let saveNutrientType;
    if (nutrientData.name.includes('Vitamin')) { //! TODO: implement a select window 
      saveNutrientType = 'vitamins';                 //!       when pressing + button
    } else {                                         //!       and asign the saveNutrientType to it
      saveNutrientType = 'minerals';
    }
    console.log(JSON.stringify(nutrientData));
    // CREATING A NUTRIENT
    nutrientsArray[rowIndex] = await fetchAPI(saveNutrientType + '/' + create, post, nutrientData); // save food

    relationData.nutrient = nutrientsArray[rowIndex].id; // reading new food ID
    // CREATING A RELATION
    foodNutrientRelations[rowIndex] = await fetchAPI(relations + create, post, relationData); // save relation
    
    // CREATING A RELATION
    activeForms[rowIndex] = await fetchAPI(forms + create, post, formData); // save relation
    
  } else {
    console.log(nutrientsArray[rowIndex]);
      responseNutrientSave = await fetchAPI // updating food data
      (nutrientsArray[rowIndex].nutrientType + '/' + currentNutrientId, patch, nutrientData);
    
      relationData.id = foodNutrientRelations[rowIndex].id; // read relation ID
      responseRelationSave = await fetchAPI // updating relation data
      (relations + relationData.id, patch, relationData);
  }

  if (responseNutrientSave.name == nutrientData.name) {
    console.log('Data updated successfully');
    createCheckmark(row);
  } else { 
    console.error('Error updating data:', responseNutrientSave);
  }
  editableInputs.forEach((input) => {
    input.disabled = true;
    input.classList.remove('active');
  });
  editSaveBtn(row); // replacing buttons

  console.log('Saved data:', JSON.stringify(relationData)); // REMOVE LATER

}

// Adding a first row to the table
async function addFooodRelationsByFood() {

  let responseRelationsData = await fetchAPI(relations + 'byFood/' + foodObject.id);
  console.log('number of Relations - ' + responseRelationsData.length); 

  for (let i = 0; i < responseRelationsData.length; i++) {

    foodNutrientRelations[i] = responseRelationsData[i]; // filling Active Forms array with received data
    nutrientsArray[i] = await findNutrientById(foodNutrientRelations[i].nutrient); // fetching nutrient data
    activeForms[i] = await fetchAPI(forms + foodNutrientRelations[i].forms); // fetching

    nutrientTable.getElementsByTagName('tbody')[0]
      .appendChild(creatingNutrientRow(nutrientsArray[i], activeForms[i], foodNutrientRelations[i]));
    }
}

async function findNutrientByName(name = foodObject.name) {
  return await fetchAPI(search + byName + name);  
}

async function findNutrientById(id) {
  return await fetchAPI(search + byId + id);
}



async function loadFoodTable() {
  const foodRowHTML = `
    <tr id='food-row'>
      <td>
        <input class='id-input' disabled='true' type="text"
        value='${foodObject.id}'>
        </input>
      </td>
      <td>
        <input class='editable foodName-input' disabled='true' type="text"
          value='${foodObject.foodName}'>
        </input>
      </td>
          <td style="width: 48%">
        <input class='editable description-input' disabled='true' type="text"
          value='${foodObject.description}'>
        </input>
      </td>
          <td>
        <input class='editable image-input' disabled='true' type="text"
          value='${foodObject.image}'>
        </input>
      </td>
    </tr>
`;
    tbodyFood.insertAdjacentHTML("afterbegin", foodRowHTML);
    // TEXT EDITOR
    const descriptionInput = tbodyFood.querySelector('.description-input');
    descriptionInput.addEventListener('click', () => {
    const expandedTextField = document.createElement('textarea');
    expandedTextField.classList.add('expanded-text-field');
    expandedTextField.value = descriptionInput.value;
    expandedTextField.placeholder = 'Type-in description here...';

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
  let foodRow = document.getElementById('food-row')
  // Adding Buttons to the table
  const actionCell = document.createElement('td'); // new column
  actionCell.style.width = '10%';
  actionCell.style.height = '42px';
  actionCell.style.display = 'flex';
  actionCell.style.flexDirection = 'row';
  actionCell.style.alignItems = 'center';
  // actionCell.style.justifyContent = 'center';
  const editButton = document.createElement('i'); // new Edit button
  // editButton.textContent = 'Edit'; // button text
  editButton.classList.add('edit-button'); // add class to the button
  editButton.addEventListener('click', () => toggleEditMode(foodRow)); // add event listener to the button
  // Save button
  const saveButton = document.createElement('i'); // add Save button
  saveButton.textContent = 'Save'; // button text
  saveButton.classList.add('save-button'); // add class to the button
  saveButton.addEventListener('click', () => saveNutrient(foodRow));  // add event listener to the button
  saveButton.style.display = 'none'; // Hide Save button by default
  // Delete button
  const deleteButton = document.createElement('i'); // add Delete button
  deleteButton.textContent = 'Delete'; // button text
  deleteButton.classList.add('delete-button'); // add class to the button
  deleteButton.addEventListener('click', () => deleteRow(foodRow));  // add event listener to the button

  actionCell.appendChild(editButton); // Add Edit button to the action cell
  actionCell.appendChild(saveButton);  // Add Save button to the action cell
  actionCell.appendChild(deleteButton);  // Add Delete button to the action cell
  foodRow.appendChild(actionCell);
  return foodRow;
}
 
async function saveNutrient(row) {
  let formId = row.querySelector('.id-input').value; // insert Form ID (same as in the form object
  console.log('SAVE ROW - ' + formId);
  let editableInputs = row.querySelectorAll('.editable');
  let data = {
    id: foodObject.id,
    name: editableInputs[0].value,
    fullName: editableInputs[1].value,
    description: editableInputs[2].value,
    image: editableInputs[4].value,
    nutrientType: nutrient.nutrientType
  };

  let responseSave;
  if (formId == '0') {
    responseSave = await fetchAPI(food + create, post, data);
    formId.value = responseSave.id; // update Form ID
  } else {
    data.id = formId; // only for patching
    responseSave = await fetchAPI
      (nutrientfoodType + formId, patch, data);
  }

  if (responseSave.name == data.name) { 
    console.log('Nutrient Data updated successfully');
    foodObject = responseSave;
    createCheckmark(row);
  }
  editableInputs.forEach((input) => {
    input.disabled = true;
    input.classList.remove('active');
  });
  editSaveBtn(row); // replacing buttons
}

  async function addNewFoodForm() {
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
    const addFoodFormHTML = `
      <h3>Add Food</h3>
      <form id="api-form">
        <label for="name">Food Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="rda">Description:</label>
        <input type="text" id="rda" name="rda">
        <label for="image">Upload Image:</label>
        <input type="file" id="image" name="image" accept="image/*">
        <button id="submit" type="submit">Create</button>
      </form>
      <div id="success-message"></div>
    `;
    modalContent.innerHTML = addFoodFormHTML;
    modalContent.appendChild(closeButton);
    overlay.appendChild(modalContent);

    // FORM SUBMIT
    const form = modalContent.querySelector("#api-form");
    const successMessage = modalContent.querySelector("#success-message");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const imageFile = formData.get("image");

        let imagePath = '';
        if (imageFile) {
            try {
              imagePath = await uploadImage(imageFile, 'food');
              console.log('Image uploaded successfully:', imagePath);
            } catch (error) {
                successMessage.textContent = 'Failed to upload image.';
                return;
            }
        }

        const requestData = {
            foodName: formData.get("name"),
            description: formData.get("description"),
            image: imagePath
        };
        console.log('Request data:', requestData);
        try {
            const responseData = await fetchAPI(
                `food/create`,
                'POST',
                requestData
            );

            if (responseData.name === requestData.name) {
                const id = responseData.id;
                successMessage.textContent = `Created successfully, ID: ${id}`; 
                setTimeout(() => {
                    window.location.href = `${host}food/edit/${id}`;
                }, 3000); // 3 second delay
            }
        } catch (error) {
            successMessage.textContent = 'Failed to create food.';
        }
    });

    // CLOSE MODAL
    closeButton.addEventListener("click", () => {
      // overlay.remove();
      overlay.classList.toggle('active');
    });
}
  
function activateAddForm() { 
  document.querySelector('.modal-overlay').classList.toggle('active');
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
      const response = await fetch(`/upload-image/food`, {
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