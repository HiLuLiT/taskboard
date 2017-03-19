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

      // delete from appData in matched location
      appData.lists.splice(index, 1);

    }
  });
}


function deleteMemberFromAppData(memberId) {
  appData.members.forEach((appDataMember, index) => {
    if (appDataMember.id === memberId) {
      appData.members.splice(index, 1);
    }
  });
}

function deleteMemberFromAppDataTasks(memberId) {
  appData.lists.forEach((list) => {
    list.tasks.forEach((task) => {
      task.members.forEach((member, index) => {
        if (member === memberId) {
          task.members.splice(index, 1);
        }
      });
    });
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

function addNewMemberToAppData(id, span) {
  const newMember = {
    id: id,
    name: span
  };
  appData.members.push(newMember);
}

function editListTitleInAppData(input, listID) {
  appData.lists.forEach((item) => {
    if (listID === item.id) {
      item.title = input;
    }

  });
}


function saveModalChangesToAppData(event) {
  const target = event.target;
  const modal = target.closest('.mymodal');
  const cardID = modal.querySelector('.relevent-card-id').textContent;
  const listID = modal.querySelector('.relevent-list-id').textContent;
  let textBox = modal.querySelector('.text-box').value;
  // update text in appData
  const appDataLists = appData.lists;
  for (const list of appDataLists) {
    for (const task of list.tasks) {
      if (task.id === cardID) {
        task.text = textBox;
      }
    }
  }
  updateCheckedMembersInAppData(modal, cardID);
  moveList(modal, cardID, listID);
  initPageByHash();
  closeEditModal();
}

function moveList(modal, cardID, listID) {
  const listMenu = modal.querySelectorAll('option');
  const matchingCard = findCardByID(cardID);

  for (const option of listMenu) {

    if (option.selected === true) {

      const optionID = option.getAttribute('unique-id');
      const matchingList = findListByID(optionID);
      const currentList = findListByID(listID);

      if (optionID !== currentList.id) {

        // push card to selected list in AppData
        matchingList.tasks.push(matchingCard);


        // remove card from current list

        currentList.tasks.forEach((task, index) => {
          if (task.id === cardID) {
            currentList.tasks.splice(index, 1);
          }
        });
      }
    }
  }
}

//delete card from appData
function deleteCardFromAppData() {

}

//update checked members in appData
function updateCheckedMembersInAppData(modal, cardID) {
  const memberInputs = modal.querySelectorAll('input');
  const matchingCard = findCardByID(cardID);
  matchingCard.members = [];
  for (const input of memberInputs) {
    if (input.checked) {
      matchingCard.members.push(input.getAttribute('unique-id'));
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
    const inputTemplate = `<li class="list-group-item add-member-list-item">
  <button class="btn btn-primary add-member-button" type="button">Add</button>
    <div class="col-xs-5 add-member-div">
    <input class="form-control add-member-input" type="text" placeholder="Add New Member">
    </div>
    </li>
`
    const wrapUl = document.querySelector('.list-group');
    wrapUl.innerHTML = inputTemplate;

    for (const member of appData.members) {
      addMembers(member);
    }

    const addMember = document.querySelector('.add-member-button');
    addMember.addEventListener('click', addMembers);

    // catch wrapUL

    targetLi = document.querySelector(hash);
  }

  if (hash === '#board') {

    // Build board skeleton
    const boardTemplate = ` 
 <ul class="flex-wrap lists-wrap">
    <li class="add-li">
      <div class="panel panel-info">
        <div class="panel-heading add-list-panel">
          <button class="panel-title add-list-btn li-btn">Add a List...</button>
        </div>
      </div>
    </li>
  </ul>
<div class="modal mymodal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
      <div class="modal-content">
      <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span class="close-x"
    aria-hidden="true">&times;</span>
    </button>
    <h4 class="modal-title">Edit Card</h4>
    </div>

    <div class="modal-body">
      <form class="form-horizontal">
      <div class="form-group">
      <label for="cardtext" class="col-sm-2 control-label">Card Text:</label>
    <div class="col-sm-10">
      <textarea class="form-control text-box" id="cardtext" rows="5"></textarea>
      <span class="relevent-card-id"></span>
      <span class="relevent-list-id"></span>
      </div>
      </div>
      <div class="form-group">
      <label for="moveto" class="col-sm-2 control-label">Move To:</label>
    <div class="col-sm-10">
      <select id="moveto" class="form-control select-list-menu"> 
      </select>
      </div>
      </div>
      <div class="form-group">
      <label class="col-sm-2 control-label">Members:</label>
    <div class="col-sm-7">
      <div class="panel panel-default">
      <div class="panel-body members-checkbox">    
    </div>
    </div>
    </div>
    </div>
    <button type="button" class="btn btn-danger delete-card">Delete Card</button>
    </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default close-btn" data-dismiss="modal">Close</button>
      <button type="button" class="btn btn-primary save-btn">Save changes</button>
    </div>
    </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->`;

    const mainSection = document.querySelector('.main-section');
    mainSection.innerHTML = boardTemplate;

    // creates board lists from appData with addNewList function
    for (const list of appData.lists) {
      addNewList(list);
    }
    addListHandler();

    const modal = document.querySelector('.modal');

    // handle Modal closing Events
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeEditModal);
    const closeX = modal.querySelector('.close-x');
    closeX.addEventListener('click', closeEditModal);

    // handle modal Save event
    const saveBtn = modal.querySelector('.save-btn');
    saveBtn.addEventListener('click', saveModalChangesToAppData);

    // add members to modal from members appData
    const membersFromAppData = appData.members;
    const membersDiv = modal.querySelector('.members-checkbox');
    for (const member of membersFromAppData) {
      membersDiv.innerHTML += `<div class="checkbox">
      <label>
      <input type="checkbox" value="${member.name}" unique-id="${member.id}">${member.name}
    </label>
    </div>`;
    }

    // add lists to modal from appData
    const listsFromAppData = appData.lists;
    const listsMenu = modal.querySelector('.select-list-menu');
    for (const list of listsFromAppData) {
      listsMenu.innerHTML += `<option value="${list.title}" unique-id="${list.id}">${list.title}</option>`;

    }

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
        <div class="panel-heading add-list-panel">
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

function titleInputKeyHandler(event) {
  const target = event.target;

  if (event.keyCode === 13) {
    titleChangeHandler(target);
  }
}

function titleBlurHandler(event) {
  const target = event.target;
  titleChangeHandler(target);
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

function titleChangeHandler(target) {
  //take the value from the input
  const value = target.value;

  // update the span(title) with that value
  const titleElm = target.parentNode.querySelector('span');
  titleElm.textContent = value;

  // ===== update appData
  const listId = titleElm.closest('li');
  const listUniqueId = listId.getAttribute('unique-id');

  editListTitleInAppData(titleElm.textContent, listUniqueId);


  //since span is currently hidden, we need to hide the input and show the span
  target.style.display = 'none';
  titleElm.style.display = 'inline-block';
}

//creates new card <li> with class & content & EDIT BTN & assigned members initials
// cards list gives me the <ul> where add new card was clicked, taskData brings me lists from appData
function addCard(cardslist, taskData) {

  const newCardElm = document.createElement('li');
  const cardTextSpan = document.createElement('span');
  const editBtn = document.createElement('button');
  const membersDiv = document.createElement('div');
  cardTextSpan.className = "card-text-span";
  membersDiv.className = "member-labels";
  editBtn.className = 'btn btn-info edit-card-btn btn-xs';
  editBtn.textContent = "Edit Card";
  editBtn.addEventListener('click', showEditModal);


  if (taskData) {
    // ====== if there's data from appData - adding cards from appData ======

    newCardElm.className = "main-li";

    // give cards unique-id from appData
    newCardElm.setAttribute('unique-id', taskData.id);

    // inserting text to span  from appData
    cardTextSpan.textContent = taskData.text;
    // newCardElm.textContent = taskData.text;

    //TODO - review this safely and surely
    // gets memberID from appData.lists.tasks,members
    const membersFromAppDataLists = taskData.members;

    // it's an array of Id's so we need to loop on it
    for (const memberID of membersFromAppDataLists) {
      let newName;
      // and compare between it's ID to members.id, where every ID has a name
      const membersFromAppDataMembers = appData.members;
      for (const appDataMember of membersFromAppDataMembers) {

        // if the ID from the lists match the ID from the member, apply it's name
        if (appDataMember.id === memberID) {
          newName = appDataMember.name;
        }
      }

      // inserting members initials to each card from appData
      const memberName = document.createElement('span');
      const nameArr = newName.split(' ');
      const initialsArr = [];
      for (const name of nameArr) {
        const letter = name[0];
        initialsArr.push(letter);
      }
      memberName.textContent = initialsArr.join('');
      memberName.title = newName;
      memberName.className = "label label-primary member-label";
      membersDiv.appendChild(memberName);
    }
    newCardElm.appendChild(membersDiv);
    newCardElm.appendChild(editBtn);
    newCardElm.appendChild(cardTextSpan);
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
    cardTextSpan.textContent = newCardData.text;

    addnewCardtoAppData(cardslist, newCardData);
    cardslist.appendChild(newCardElm);
    newCardElm.appendChild(cardTextSpan);
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
function makeListSupportTitle(newLi) {

// target all titles (spans)
  const titleElm = newLi.querySelector('.span-elm');
  titleElm.addEventListener('click', titleClickHandler);

// targets all inputs
  const titleInput = document.querySelectorAll('.list-li .title-input');

  for (const title of titleInput) {
    // adds key down event listener and runs function
    title.addEventListener('keydown', titleInputKeyHandler);

    // adds blur event listener and runs function
    title.addEventListener('blur', titleBlurHandler);
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

function showEditModal(event) {
  //show modal
  const modal = document.querySelector('.mymodal');
  modal.style.display = 'block';

  // target card id & list id and insert it to modal
  let target = event.target;
  //TODO - change parentNode to closest
  const targetCard = target.parentNode;

  const targetList = targetCard.closest('.list-li');

  const listID = targetList.getAttribute('unique-id');
  const cardID = targetCard.getAttribute('unique-id');

  const releventCardSpan = modal.querySelector('.relevent-card-id');
  const releventListSpan = modal.querySelector('.relevent-list-id');
  releventCardSpan.textContent = cardID;
  releventListSpan.textContent = listID;

  let textBox = modal.querySelector('.text-box');

  // fill modal with text FROM appData
  const cardInAppData = findCardByID(cardID);
  textBox.value = cardInAppData.text;

  // const appDataLists = appData.lists;
  // for (const list of appDataLists) {
  //   for (const task of list.tasks) {
  //     if (task.id === releventCardSpan.textContent) {
  //       textBox.textContent = task.text;
  //     }
  //   }
  // }

  const matchingCard = findCardByID(cardID);
  // fill modal with checked members
  const memberInputs = modal.querySelectorAll('input');
  for (const input of memberInputs) {
    for (const member of matchingCard.members)
      if (input.getAttribute('unique-id') === member) {
        input.checked = 'true';
      }
  }

  // update modal with relevent list
  const moveOptions = modal.querySelectorAll('option');
  for (let option of moveOptions) {
    if (option.getAttribute('unique-id') === releventListSpan.textContent) {
      option.selected = 'true';
    }
  }

  //handle delete button
  const deleteBtn = modal.querySelector('.delete-card');
  console.info(deleteBtn);

}

function findCardByID(cardId) {
  const appDatalists = appData.lists;
  for (const list of appDatalists) {
    for (const task of list.tasks)
      if (task.id === cardId) {
        return task;
      }
  }
}

function findListByID(listID) {
  const appDatalists = appData.lists;
  for (const list of appDatalists) {
    if (list.id === listID) {
      return list
    }
  }

}

function closeEditModal() {
  const modal = document.querySelector('.mymodal');
  modal.style.display = 'none';
  // initPageByHash();

}


// gets members names from appData, creates new lists with them
function addMembers(membersList) {

  const wrapUl = document.querySelector('.list-group');
  const newMemberLi = document.createElement('li');
  newMemberLi.className = 'list-group-item';
  const memberTemplate = `
      <span class="member-name-span"></span>
      <input class="form-control edit-member-name">
      <div class="btn-container member-btns">
      <button type="button" class="btn btn-xs btn-info edit-member">Edit</button>
      <button type="button" class="btn btn-xs btn-danger delete-member">Delete</button>
      </div>
      <div class="btn-container edit-member-mode-btns">
      <button type="button" class="btn btn-xs btn-default cancel-edit">Cancel</button>
      <button type="button" class="btn btn-xs btn-success save-btn">Save</button>
      </div>
      `
  newMemberLi.innerHTML = memberTemplate;
  const span = newMemberLi.querySelector('.member-name-span');
  const input = newMemberLi.querySelector('.edit-member-name');
  const addMemberListItem = document.querySelector('.add-member-list-item');

  if (membersList !== undefined && !membersList.type) {
    // ======= if there's appData member DATA =========
    const iD = membersList.id;
    newMemberLi.setAttribute('unique-id', iD);
    const dataName = membersList.name;
    span.innerHTML = dataName;
    input.value = dataName;
  }

  else {
    // ====== if it's new member (not from AppData)

    newMemberLi.setAttribute('unique-id', uuid());
    const memberNameInput = document.querySelector('.add-member-input');
    span.innerHTML = memberNameInput.value;
    input.value = memberNameInput.value;

    const newMemberId = newMemberLi.getAttribute('unique-id');
    addNewMemberToAppData(newMemberId, span.textContent);
  }

  // push newly created <li> to it's location + target it
  const newMember = wrapUl.insertBefore(newMemberLi, addMemberListItem);

  // add event listener to edit btn OF NEW MEMBER (not document, this way I don't repeat event listeners)
  const editButton = newMember.querySelector('.edit-member');
  editButton.addEventListener('click', handleEditMemberMode);

  // when cancel is clicked - remove edit-mode from <li>
  const cancelBtn = newMember.querySelector('.cancel-edit');
  cancelBtn.addEventListener('click', handleCancelEvent);

  // save member name change
  const saveBtn = newMember.querySelector('.save-btn');
  saveBtn.addEventListener('click', handleSaveMember);

  // delete member
  const deleteMember = newMember.querySelector('.delete-member');
  deleteMember.addEventListener('click', handleDeleteMember);

}


function handleDeleteMember(event) {
  const target = event.target;
  const memberLi = target.closest('li');
  const memberId = memberLi.getAttribute('unique-id');
  // remove memberLi from ui
  memberLi.remove();
  // remove from appData
  deleteMemberFromAppData(memberId);
  deleteMemberFromAppDataTasks(memberId);
}

function handleSaveMember(event) {
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
  DataList.open("GET", "assets/board-advanced.json");
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

targetAllAddCardBtns();

initTopbar();
getBoardData();
getMembersData();


