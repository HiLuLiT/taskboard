
//
function addListHandler(event) {
  // Get a reference to the parent element
  const dadUl = document.querySelector('.lists-wrap');
  const addList = document.querySelector('.add-li');

  let newLi = document.createElement('li');
  newLi.className = "card-li";
  newLi.innerHTML = `
     <div class="panel panel-default">
        <div class="panel-heading">
          <span class="span-elm panel-title li-title" >New List</span>
          <input type="text">
          <div class="dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="true">
              <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
              <li><a href="#">Delete List</a></li>
            </ul>
          </div>
        </div>
        <div class="panel-body">
          <ul class="main-ul">
     
          </ul>
        </div>
        <div class="panel-footer">
          <button class="add-card-btn">Add a Card...</button>
        </div>
      </div>`;

  dadUl.insertBefore(newLi, addList);
  initialListTitles(newLi);

  //add listeners to 'add card' btns
  const addBtn = newLi.querySelector('.add-card-btn');
  handleAddingCardEvent(addBtn);

  // add listener to dropdown btns
  const dropDownBtn = newLi.querySelector('.dropdown-toggle');
  makeTheButtonSupportDelete(dropDownBtn);
}

function CreateNewList() {
  const addList = document.querySelector('.add-li');
  addList.addEventListener('click', addListHandler);
}


// Adds new Cards to Lists
function handleAddingCardEvent(button) {
  button.addEventListener('click', function (e) {
    const list = e.target.parentNode.parentNode;
    const ul = list.querySelector('.main-ul');
    addCard(ul);
  });
}


function initButtonsPage() {
  const buttons = document.querySelectorAll('.add-card-btn');

  for (const btn of buttons) {
    handleAddingCardEvent(btn);
  }
}

function addCard(cardslist) {
  const newCard = document.createElement('li');
  newCard.className = "main-li";
  newCard.textContent = "Another Card";
  cardslist.appendChild(newCard);
}


function initialListTitles() {
// target all spans
  const titleElm = document.querySelectorAll('.span-elm');

// on span click hides span & shows input with text and focus
  for (const title of titleElm) {
    title.addEventListener('click', function (event) {

      let target = event.target;
      const inputElm = target.parentNode.querySelector('input');

      // hide the clicked title
      target.style.display = 'none';

      // show the input next to the span
      inputElm.style.display = 'inline-block';
      inputElm.value = target.textContent;
      inputElm.focus();
    });
  }

  // targets all the inputs and adds them keydown listener
  const titleInput = document.querySelectorAll('.card-li input');

  for (const title of titleInput) {
    title.addEventListener('keydown', function (event) {
      const target = event.target;

      if (event.keyCode === 13) {
        //take the value from the input
        const value = target.value;
        // update the span(title) with that value
        const titleElm = target.parentNode.querySelector('span');
        titleElm.innerHTML = value;

        //since span is currently hidden, we need to hide the input and show the span
        target.style.display = 'none';
        titleElm.style.display = 'inline-block';
      }
    });

    title.addEventListener('blur', function (event) {
      const target = event.target;
      //take the value from the input
      const value = target.value;
      // update the span(title) with that value
      const titleElm = target.parentNode.querySelector('span');
      titleElm.innerHTML = value;

      //since span is currently hidden, we need to hide the input and show the span
      target.style.display = 'none';
      titleElm.style.display = 'inline-block';
    });
  }
}

// Dropdown menu & delete list

// show ul when button is clicked

const dropDownBtn = document.querySelectorAll('.dropdown-toggle');
for (const btn of dropDownBtn) {
  makeTheButtonSupportDelete(btn);
}
function makeTheButtonSupportDelete (btn) {
  //add event listeners to each dropdown btn
  btn.addEventListener('click', openUL);

// delete list functionality
  const dropDownUl = btn.parentNode.querySelector('.dropdown-menu');
  const aElm = dropDownUl.querySelector('li a');
  aElm.addEventListener('click', deleteListItem);
}

//
function openUL(event) {
  //display block ul; catch ul, display it:
  const target = event.target;
  const targetParent = target.parentNode.parentNode;
  const targetUL = targetParent.querySelector('.dropdown-menu');
  toggleUL(targetUL);
  //
}

function toggleUL(targetList) {
  if (((targetList.style.display) === 'none') || ((!targetList.style.display))) {
    targetList.style.display = 'block';
  }
  else
    targetList.style.display = 'none';
}


function deleteListItem(event) {
  const target = event.target;
  const liItem = target.closest('.card-li');
  const liItemName = liItem.querySelector('span');
  console.log(liItemName.innerHTML);
  const isSure = confirm(`Are you sure you want to delete ${liItemName.innerHTML} ?`);

  if (isSure === true) {
    liItem.remove();
  }
}



/**
 * Init the app
 */

initButtonsPage();
CreateNewList();
initialListTitles();
