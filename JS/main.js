const appData = {
  lists: [],
  members: []
};
console.info(appData);
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
    const memberTemplate =`<section class="members-section">
  <h2 class="members-header">Taskboard Members</h2>
  <ul class="list-group">

  </ul>
</section>`;

    // put it in main section
    const mainSection = document.querySelector('.main-section');
    mainSection.innerHTML = memberTemplate;

    for (const list of appData.members) {
      addMembers(list);
    }

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

    // target data title
    const dataTitle = data.title;

    // target new list title and gives it title from data
    listTitle.innerHTML = dataTitle;

    // target new list's UL
    const mainUl = newLi.querySelector('.main-ul');

    // target array of tasks objects
    const taskData = data.tasks;

    for (const data of taskData) {
      addCard(mainUl, data);
    }
  }
  else {
    // ====== if it's new list ==========

    let newlistTitle = appData.lists.length;
    // object should have tasks and title properties - tasks is an empty Array, title: "New Title"
    const newListObj = {
      tasks: [],
      title: `New List ${newlistTitle}`,
    };

    // push new object into appData.lists
    appData.lists.push(newListObj);
    console.info(appData);

    // update UI
    listTitle.innerHTML = `New List ${newlistTitle}`;

    // const updateTitle = document.querySelector('.li-title');
    // console.info(updateTitle);
    //


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
    newCardElm.className = "main-li";
    newCardElm.textContent = taskData.text;

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
    // ==== if there's no data from appata=====

    // ====update appData====

    // create new card
    const newCardData = {
      members: [],
      text: "I'm a new Card",
    };

    newCardElm.className = "main-li";
    newCardElm.textContent = newCardData.text;

    // catch title on clicked list (so we can compare it to appData & find it's matching location)
    const liTitle = cardslist.closest('.panel-default').querySelector('.li-title').textContent;
    console.info(liTitle);


    appData.lists.forEach( (item) => {
       if (item.title === liTitle) {
         // push new card to the matched location
         item.tasks.push(newCardData);
       }
    });

    cardslist.appendChild(newCardElm);
    // newCard.appendChild(editBtn);

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

// ==== opens edit modal =====


function handleClosing() {
  const closeBtn = document.querySelector('.close-btn');
  closeBtn.addEventListener('click', toggleEditModal);
  const closeX = document.querySelector('.close-x');
  closeX.addEventListener('click', toggleEditModal);
}

function toggleEditModal(event) {
  const modalDisplay = document.querySelector('.mymodal');
  if (modalDisplay.style.display === ('block')) {
    modalDisplay.style.display = ('none');
  }
  else {
    modalDisplay.style.display = ('block');
  }
}


// gets members names from JSON, creates new lists with them, then runs addButtonsMember
function addMembers(membersList) {
  if (membersList !== undefined && !membersList.type) {
    // ======= if there's JSON member DATA =========
    const dataName = membersList.name;
    const wrapUl = document.querySelector('.list-group');
    const newMemberLi = document.createElement('li');

    newMemberLi.innerHTML = dataName;
    newMemberLi.className = 'list-group-item';
    const addMemberListItem = document.querySelector('.add-member-list-item');
    wrapUl.insertBefore(newMemberLi, addMemberListItem);
    addButtonsMember(newMemberLi);
  }
  addNewMemberInput();

// adds edit & delete buttons to every list member
  function addButtonsMember(list) {
    const liButtons = document.createElement('div');
    liButtons.className = 'btn-container';
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-xs btn-info edit-member';
    editBtn.innerHTML = "Edit";
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-xs btn-danger delete-member';
    deleteBtn.innerHTML = "Delete";
    liButtons.appendChild(editBtn);
    liButtons.appendChild(deleteBtn);
    list.appendChild(liButtons);
  }
}

function addNewMemberInput() {
  const addNewMember = document.createElement('li');
  addNewMember.className = 'list-group-item add-member-list-item';
  const inputDiv = document.createElement('div');
  inputDiv.className = 'col-xs-8 add-member-input';
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


function updateJsonState (jName) {
  // if (jName === 'board') {
  //   jsonsAreHere.board = true;
  // }
  // if (jName === 'members') {
  //   jsonsAreHere.members = true;
  // }

  jsonsAreHere[jName]=true;

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


