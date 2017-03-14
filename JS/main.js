/**
 * MODEL ----> appData Manipulation
 *
 */


const appData = {
  lists: [],
  members: []
};

function removeListFromappData(listName) {
  appData.lists.forEach((item, index) => {

    if (item.title === listName.textContent) {

      // delete card from appData in matched location
      appData.lists.splice(index, 1);

    }
  });
}

function addNewListToappData(newListObj) {
  appData.lists.push(newListObj);
}

function addnewCardtoAppData(cardslist, newCardData) {

  // catch clicked list unique-ID (so we can compare it to appData & find it's matching location)
  const liID = cardslist.closest('.list-li').getAttribute('unique-id');

  appData.lists.forEach((item) => {
    if (item.id === liID) {
      // push new card to the matched location
      item.tasks.push(newCardData);
      // console.info(appData);
    }
  });
}

function saveMemberToAppData(memberId, memberInput) {
  for (const appDataMember of appData.members) {
    if (appDataMember.id === memberId) {
      appDataMember.name = memberInput;
    }
  }
}


/**
 * VIEW ------> UI Manipulation
 */

// target the wrapper ul and add it click/hash listener so we can get what we clicked on - through event delegation
// (click listening to the <li> might be tricky since it has <a> and <span> in it).

function initTopbar() {
  window.addEventListener('hashchange', () => {
    initPageByHash();
  });

}

function initPageByHash() {
  const hash = window.location.hash;
  // if no hash, go to default page
  if (!hash) {
    window.location.hash = '#board';
    // stop the function otherwise it will keep on running and the listener wil call the function again
    return;
  }

  const topbar = document.querySelector('.navbar > ul');

  // find the active one - first I have to go up to the <ul>, then find the <li> with active
  const currentActive = topbar.querySelector('.active');
  let targetLi;

  // remove the active class from it
  currentActive.classList.remove('active');

  if (hash === '#members') {

    // Build Members Skeleton
    const memberTemplate = `<section class="members-section">
  <h2 class="members-header">Taskboard Members</h2>
  <ul class="list-group">

  </ul>
</section>`;

    // put it in main section
    const mainSection = document.querySelector('.main-section');
    mainSection.innerHTML = memberTemplate;
    const wrapUL = document.querySelector('.list-group');
    addNewMemberInput();

    for (const member of appData.members) {
      addMembers(member, wrapUL);

    }
    // catch wrapUL

    targetLi = document.querySelector(hash);
  }

  if (hash === '#board') {

    // Build board skeleton
    const boardTemplate = ` 
 <ul class="flex-wrap lists-wrap">
    <li class="add-li">
      <div class="panel panel-info">
        <div class="panel-heading">
          <button class="panel-title add-list-btn li-btn">Add a List...</button>
        </div>
      </div>
    </li>
  </ul>`;
    const mainSection = document.querySelector('.main-section');

    //put it in main section
    mainSection.innerHTML = boardTemplate;

    // creates board lists from appData with addNewList function
    for (const list of appData.lists) {
      addNewList(list);
    }
    addListHandler();

    // add class hidden to member
    // remove class hidden from board
    targetLi = document.querySelector(hash);
  }

  //add active to the <li> of clicked one
  targetLi.classList.add('active');
}

//====== NEW LISTS =====
// getting board lists data from appData, creates new <li>
function addNewList(data) {

  // Get a reference to the parent element
  const dadUl = document.querySelector('.lists-wrap');
  const addList = document.querySelector('.add-li');

  let newLi = document.createElement('li');
  // newLi.setAttribute('unique-id', data ? data.id : uuid());
  newLi.className = "list-li";
  newLi.innerHTML = `
     <div class="panel panel-default">
        <div class="panel-heading">
          <span class="span-elm panel-title li-title" ></span>
          <input type="text" class="title-input">
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

  const listTitle = newLi.querySelector('.span-elm');

  if (data !== undefined && !data.type) {
// ========== if there is appData data ========

    //give the list unique-id attribute from appData "id"'s
    newLi.setAttribute('unique-id', data.id);

    // target data title
    const dataTitle = data.title;

    // target new list title and gives it title from data
    listTitle.innerHTML = dataTitle;

    // target new list's UL
    const mainUl = newLi.querySelector('.main-ul');

    // target array of tasks objects
    const taskData = data.tasks;

    // create cards for every list from appData
    for (const data of taskData) {
      addCard(mainUl, data);
    }
  }
  else {
    // ====== if it's new list (no incoming data from appData) ==========

    // object should have tasks, title and ID properties - tasks is an empty Array, title: "New Title"
    const newListObj = {
      tasks: [],
      title: `New List`,
      id: uuid()
    };

    // give the list unique-id with uuid
    newLi.setAttribute('unique-id', newListObj.id);

    // push new object into appData.lists
    addNewListToappData(newListObj);

    // update UI
    listTitle.innerHTML = `New List`;

  }
}

// adds event listener to "add new list"
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
// cards list gives me the <ul> where add new card was clicked, taskData brings me lists from appData
function addCard(cardslist, taskData) {

  const newCardElm = document.createElement('li');
  const editBtn = document.createElement('button');
  editBtn.addEventListener('click', toggleEditModal);
  const membersDiv = document.createElement('div');
  membersDiv.className = "member-labels";


  editBtn.className = 'btn btn-info edit-card-btn btn-xs';
  editBtn.textContent = "Edit Card";

  if (taskData) {
    // ====== if there's data from appData - adding cards from appData ======

    newCardElm.className = "main-li";

    // give cards unique-id from appData
    newCardElm.setAttribute('unique-id', taskData.id);

    // inserting text to card from appData
    newCardElm.textContent = taskData.text;

    // inserting members initials to each card from appData
    const dataMembers = taskData.members;
    for (const member of dataMembers) {
      const memberName = document.createElement('span');
      const secondWord = member.indexOf(' ') + 1;
      memberName.textContent = member[0] + member[secondWord];
      memberName.title = member;
      memberName.className = "label label-primary";
      membersDiv.appendChild(memberName);
    }
    newCardElm.appendChild(membersDiv);
    newCardElm.appendChild(editBtn);
    cardslist.appendChild(newCardElm);
  }

  if (!taskData) {
    // ==== if there's no data from appata - add new card=====

    // ====update appData====

    // create new card
    const newCardData = {
      members: [],
      text: "I'm a new Card",
      id: uuid()
    };

    newCardElm.className = "main-li";
    newCardElm.setAttribute('unique-id', newCardData.id);
    newCardElm.textContent = newCardData.text;

    addnewCardtoAppData(cardslist, newCardData);
    cardslist.appendChild(newCardElm);
    newCardElm.appendChild(editBtn);
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

// target all titles (spans)
  const titleElm = document.querySelectorAll('.span-elm');

  for (const title of titleElm) {
    // adds click event listener and runs function
    title.addEventListener('click', titleClickHandler);
  }

  // if click - updates span with value and shows it
  function titleClickHandler(event) {
    // target input (where clicked)
    let target = event.target;
    const inputElm = target.parentNode.querySelector('.title-input');

    // hide the clicked span
    target.style.display = 'none';

    // show the input (next to the span) & gives it content & focus
    inputElm.style.display = 'inline-block';
    inputElm.value = target.textContent;
    inputElm.focus();
  }

// targets all inputs
  const titleInput = document.querySelectorAll('.list-li .title-input');

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

        // update appData


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
    removeListFromappData(liItemName);
  }
}
// ==== opens edit modal =====


function handleClosing() {
  const closeBtn = document.querySelector('.close-btn');
  closeBtn.addEventListener('click', toggleEditModal);
  const closeX = document.querySelector('.close-x');
  closeX.addEventListener('click', toggleEditModal);
}

function toggleEditModal() {
  const modalDisplay = document.querySelector('.mymodal');
  if (modalDisplay.style.display === ('block')) {
    modalDisplay.style.display = ('none');
  }
  else {
    modalDisplay.style.display = ('block');
  }
}


// gets members names from appData, creates new lists with them, then runs addButtonsMember
function addMembers(membersList, wrapUl) {

  if (membersList !== undefined && !membersList.type) {
    // ======= if there's appData member DATA =========
    const iD = membersList.id;
    const dataName = membersList.name;
    const newMemberLi = document.createElement('li');
    newMemberLi.setAttribute('unique-id', iD);

    newMemberLi.className = 'list-group-item';
    const addMemberListItem = document.querySelector('.add-member-list-item');

    const buttonsTemplate = `
      <span class="member-name-span">${dataName}</span>
      <input class="form-control edit-member-name" value="${dataName}">
      <div class="btn-container member-btns">
      <button type="button" class="btn btn-xs btn-info edit-member">Edit</button>
      <button type="button" class="btn btn-xs btn-danger delete-member">Delete</button>
      </div>
      <div class="btn-container edit-member-mode-btns">
      <button type="button" class="btn btn-xs btn-default cancel-edit">Cancel</button>
      <button type="button" class="btn btn-xs btn-success save-btn">Save</button>
      </div>
      `
    newMemberLi.innerHTML = buttonsTemplate;
    console.info(typeof dataName);
    // target newly created <li>
    const newMember = wrapUl.insertBefore(newMemberLi, addMemberListItem);

    // add event listener to edit btn OF NEW MEMBER (not document, this way I don't repeat event listeners)
    const editButton = newMember.querySelector('.edit-member');
    editButton.addEventListener('click', handleEditMemberMode);

    // when cancel is clicked - remove edit-mode from <li>
    const cancelBtn = newMember.querySelector('.cancel-edit');
    // console.info(cancelBtn);
    cancelBtn.addEventListener('click', handleCancelEvent);

    const saveBtn = newMember.querySelector('.save-btn');
    saveBtn.addEventListener('click', handleSaveMember);
  }
}

function handleSaveMember(event) {

  // save to span
  const target = event.target;
  const memberLi = target.closest('li');
  const memberInput = memberLi.querySelector('input').value;
  const memberName = memberLi.querySelector('span');
  memberName.textContent = memberInput;
  memberLi.classList.toggle('edit-mode');
  const memberId = memberLi.getAttribute('unique-id');

  // save to appData
  saveMemberToAppData(memberId, memberInput);
}

function handleCancelEvent(event) {
  const target = event.target;
  const memberLi = target.closest('li');
  const memberName = memberLi.querySelector('span').innerHTML;
  const memberInput = memberLi.querySelector('input');
  memberInput.value = memberName;
  memberLi.classList.toggle('edit-mode');

}

function handleEditMemberMode(event) {
  // target is edit btn
  const target = event.target;

  // target li
  const memberLi = target.closest('li');
  const inputField = memberLi.querySelector('input');
  // when edit clicked - give <li> edit-mode class
  memberLi.classList.toggle('edit-mode');
  inputField.focus();

}

// const deleteMember = target.closest('div').querySelector('.delete-member');
// console.info(deleteMember);
// deleteMember.style.display = 'none';
// target.style.display = 'none';

// // show Cancel+Save buttons
// const editModeButtons = target.closest('div').querySelector('.edit-mode');
// editModeButtons.classList.toggle('edit-mode');


// show input field
// const inputField = document.createElement('input');
//   // inputField.className ='form-control edit-member-name';
//   // const editListName = target.closest('li');
//   // editListName.appendChild(inputField);
//
//   // hide span & fill input placeholder with span text content
//   const spanName = target.closest('li').querySelector('span');
//   spanName.style.display = 'none';
//   inputField.placeholder = spanName.textContent;
//
//   const allCancelBtns = document.querySelectorAll('.cancel-edit');
//   for (const cancelBtn of allCancelBtns) {
//     cancelBtn.addEventListener('click', function() {
//       // hide input and show span
//       inputField.style.display = 'none';
//       spanName.style.display = 'block';
//
//       // hide edit-mode & show edit+delete
//       editModeButtons.classList.toggle('edit-mode');
//       deleteMember.style.display = 'inline-block';
//       target.style.display = 'inline-block';
//     });
//   }
// }


// function cancelEditMode (event) {
//   const target = event.target;
//
//   // hide input
//   const inputField = target.closest('div');
//   console.info(inputField);
// }


function addNewMemberInput() {
  const addNewMember = document.createElement('li');
  addNewMember.className = 'list-group-item add-member-list-item';
  const inputDiv = document.createElement('div');
  inputDiv.className = 'col-xs-5 add-member-input';
  const newMemberInput = document.createElement('input');
  const addMemberButton = document.createElement('button');
  addMemberButton.className = 'btn btn-primary';
  addMemberButton.innerHTML = 'Add';
  addMemberButton.type = 'button';
  newMemberInput.className = 'form-control';
  newMemberInput.type = 'text';
  newMemberInput.setAttribute("placeholder", "Add New Member");
  inputDiv.appendChild(newMemberInput);
  addNewMember.appendChild(addMemberButton);
  addNewMember.appendChild(inputDiv);

  const wrapUl = document.querySelector('.list-group');
  wrapUl.appendChild(addNewMember);
}


const jsonsAreHere = {
  members: false,
  board: false
};


function updateJsonState(jName) {
  // if (jName === 'board') {
  //   jsonsAreHere.board = true;
  // }
  // if (jName === 'members') {
  //   jsonsAreHere.members = true;
  // }

  jsonsAreHere[jName] = true;

  if (jsonsAreHere.members === true && jsonsAreHere.board === true) {
    initPageByHash();
  }


}


function reqBoardListener() {
  const localDataList = JSON.parse(this.responseText);
  const listsData = localDataList.board;
  appData.lists = listsData;
  updateJsonState('board');
  // initPageByHash();
}

function reqMemberListener() {
  const memberDataList = JSON.parse(this.responseText);
  const listsData = memberDataList.members;
  appData.members = listsData;

  updateJsonState('members');
}

function getBoardData() {
  var DataList = new XMLHttpRequest();
  DataList.addEventListener("load", reqBoardListener);
  DataList.open("GET", "assets/board.json");
  DataList.send();
}

function getMembersData() {
  var membersList = new XMLHttpRequest();
  membersList.addEventListener("load", reqMemberListener);
  membersList.open("GET", "assets/members.json");
  membersList.send();
}


/**
 *
 * Init the app
 */
handleClosing();
targetAllAddCardBtns();
makeListSupportTitle();

initTopbar();
getBoardData();
getMembersData();


