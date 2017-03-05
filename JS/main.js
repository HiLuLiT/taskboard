//====== NEW LISTS =====
function addNewList(data) {

  // Get a reference to the parent element
  const dadUl = document.querySelector('.lists-wrap');
  const addList = document.querySelector('.add-li');

  let newLi = document.createElement('li');
  newLi.className = "list-li";
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

  // adds new list to position, and makes it support title change
  dadUl.insertBefore(newLi, addList);
  makeListSupportTitle(newLi);

  //targets add new card button of new list and runs function on it
  const addBtn = newLi.querySelector('.add-card-btn');
  handleAddingCardEvent(addBtn);

  // add listener to new list's dropdown btns and makes them support delete
  const dropDownBtn = newLi.querySelector('.dropdown-toggle');
  makeTheButtonSupportDelete(dropDownBtn);

  // const editBtn = newLi.querySelector('.edit-card-btn');
  // editListButton(editBtn);


  if (data !== undefined && !data.type) {
// ========== if there is JSON data ========

    // target data title
    const dataTitle = data.title;

    // target new list title
    const listTitle = newLi.querySelector('.span-elm');
    listTitle.innerHTML = dataTitle;

    // target new list's UL
    const mainUl = newLi.querySelector('.main-ul');

    // taregt array of tasks objects
    const taskData = data.tasks;

    for (const data of taskData) {
      addCard(mainUl, data);
      const dataMembers = data.members;

    }
  }
}


// adds event listener to all existing lists
function addListHandler() {
  const addList = document.querySelector('.add-li');
  addList.addEventListener('click', addNewList);
}


// ===== NEW CARDS =======
// adds a click listener to card button and targets it's destination UL, then runs function
function handleAddingCardEvent(button) {

  button.addEventListener('click', function (e) {
    const list = e.target.parentNode.parentNode;
    const ul = list.querySelector('.main-ul');
    addCard(ul);
  });
}
//creates new card <li> with class & content & EDIT BTN & assigned members initials
function addCard(cardslist, taskData) {
  const newCard = document.createElement('li');
  const editBtn = document.createElement('button');
  const membersDiv = document.createElement('div');
  membersDiv.className = "member-labels";


  editBtn.className = 'btn btn-info edit-card-btn btn-xs';
  editBtn.textContent = "Edit Card";
  if (taskData) {
    newCard.className = "main-li";
    newCard.textContent = taskData.text;
    const dataMembers = taskData.members;
    for (const member of dataMembers) {
      const memberName = document.createElement('span');
      const secondWord = member.indexOf(' ') + 1;
      memberName.textContent = member[0] + member[secondWord];
      memberName.title= member;
      memberName.className = "label label-primary";
      membersDiv.appendChild(memberName);
    }
    newCard.appendChild(membersDiv);
    newCard.appendChild(editBtn);
    cardslist.appendChild(newCard);

  }
  if (!taskData) {
    newCard.className = "main-li";
    newCard.textContent = "Another Card";
    cardslist.appendChild(newCard);
    newCard.appendChild(editBtn);
  }
}

function targetAllAddCardBtns() {
  const buttons = document.querySelectorAll('.add-card-btn');
  for (const btn of buttons) {
    handleAddingCardEvent(btn);
  }
}


// ===== Titles ======
function makeListSupportTitle() {
// target all spans
  const titleElm = document.querySelectorAll('.span-elm');
  for (const title of titleElm) {
    // adds click event listener and runs function
    title.addEventListener('click', titleClickHandler);
  }
  // if click - updates span with value and shows it
  function titleClickHandler(event) {
    // target input (where clicked)
    let target = event.target;
    const inputElm = target.parentNode.querySelector('input');

    // hide the clicked span
    target.style.display = 'none';

    // show the input (next to the span) & gives it content & focus
    inputElm.style.display = 'inline-block';
    inputElm.value = target.textContent;
    inputElm.focus();
  }

// targets all inputs
  const titleInput = document.querySelectorAll('.list-li input');
  for (const title of titleInput) {
    // adds key down event listener and runs function
    title.addEventListener('keydown', titleInputKeyHandler);
    // if ENTER - updates span with value and shows it
    function titleInputKeyHandler(event) {
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
    };
    // adds blur event listener and runs function
    title.addEventListener('blur', titleBlurHandler);
    // if blur - updates span with value and shows it
    function titleBlurHandler(event) {
      const target = event.target;
      //take the value from the input
      const value = target.value;
      // update the span(title) with that value
      const titleElm = target.parentNode.querySelector('span');
      titleElm.innerHTML = value;

      //since span is currently hidden, we need to hide the input and show the span
      target.style.display = 'none';
      titleElm.style.display = 'inline-block';
    }
  }
}

// Dropdown menu & delete list

// show ul when button is clicked

const dropDownBtn = document.querySelectorAll('.dropdown-toggle');
for (const btn of dropDownBtn) {
  makeTheButtonSupportDelete(btn);
}
function makeTheButtonSupportDelete(btn) {
  //add event listeners to each dropdown btn
  btn.addEventListener('click', openUL);

// delete list functionality
  const dropDownUl = btn.parentNode.querySelector('.dropdown-menu');
  const aElm = dropDownUl.querySelector('li a');
  aElm.addEventListener('mousedown', deleteListItem);
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
  const liItem = target.closest('.list-li');
  const liItemName = liItem.querySelector('span');
  const isSure = confirm(`Are you sure you want to delete ${liItemName.innerHTML} ?`);

  if (isSure === true) {
    liItem.remove();
  }
}

// ==== ADD EDIT OPTION TO CARDS =====

// function addEditBtn() {
//   const editButtons = document.querySelectorAll('.edit-card-btn');
//   for (const btn of editButtons) {
//     btn.addEventListener('click', doSomethingToEdit)
//   }
//
//   function doSomethingToEdit(event) {
//     console.info("hey");
//   }
// }
/**
 *
 * Init the app
 */


targetAllAddCardBtns();
addListHandler();
makeListSupportTitle();


function reqListener() {
  const localDataList = JSON.parse(this.responseText);
  const listsData = localDataList.board;

  for (const list of listsData) {
    addNewList(list);
  }

  // const taskboard = localDataList.board
  // console.log(localDataList);

}

var DataList = new XMLHttpRequest();
DataList.addEventListener("load", reqListener);
DataList.open("GET", "assets/board.json");
DataList.send();




