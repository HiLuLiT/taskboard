(function () {

  /**
   * VIEW ------> UI Manipulation
   */
  // Clean Code Branch

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
      initPageByMembers();
      targetLi = document.querySelector(hash);
    }

    if (hash === '#board') {
      initPageByBoard();
      targetLi = document.querySelector(hash);
    }

    //add active class to the clicked <li>
    targetLi.classList.add('active');
  }

  function initPageByMembers() {

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

    for (const member of MODEL.getMembers()) {
      addMembers(member);
    }

    const addMember = document.querySelector('.add-member-button');
    addMember.addEventListener('click', addMembers);
  }

  function initPageByBoard() {

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
    for (const list of MODEL.getLists()) {
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
    addModalMembers(modal);

    // handle delete button
    const deleteBtn = modal.querySelector('.delete-card');
    deleteBtn.addEventListener('click', deleteCard);
  }

//====== LISTS =====

  function addNewList(data) {
    // getting board lists data from appData, creates new <li>


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

    const listTitle = newLi.querySelector('.span-elm');

    if (data !== undefined && !data.type) {
// ========== if there is appData data ========

      //give the list unique-id attribute from appData "id"'s
      newLi.setAttribute('unique-id', MODEL.getListID(data));

      // target data title
      const dataTitle = MODEL.getListTitle(data);

      // target new list title and gives it title from data
      listTitle.innerHTML = dataTitle;

      // target new list's UL
      const mainUl = newLi.querySelector('.main-ul');

      // target array of tasks objects
      const taskData = MODEL.getTasks(data);

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
      MODEL.addNewListToappData(newListObj);

      // update UI
      listTitle.innerHTML = `New List`;

    }
  }

  function addListHandler() {
    // adds event listener to "add new list"

    const addList = document.querySelector('.add-li');
    addList.addEventListener('click', addNewList);
  }

// ===== CARDS =======
  function handleAddingCardEvent(button) {
// adds a click listener to card button and targets it's destination UL, then runs function

    button.addEventListener('click', function (e) {
      const list = e.target.parentNode.parentNode;
      const ul = list.querySelector('.main-ul');
      addCard(ul);
    });
  }

  function addCard(cardslist, taskData) {
//creates new card <li> with class & content & EDIT BTN & assigned members initials
// cards list gives me the <ul> where add new card was clicked, taskData brings me lists from appData

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
      newCardElm.setAttribute('unique-id', MODEL.getCardID(taskData));
      // inserting text to span  from appData
      cardTextSpan.textContent = MODEL.getCardText(taskData);
      // newCardElm.textContent = taskData.text;

      // gets memberID from appData.lists.tasks.members
      const membersFromAppDataLists = MODEL.getCardMembers(taskData);

      // it's an array of Id's so we need to loop on it
      for (const memberID of membersFromAppDataLists) {
        let newName;
        // and compare between it's ID to members.id, where every ID has a name
        const membersFromAppDataMembers = MODEL.getMembers();
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

      MODEL.addnewCardtoAppData(cardslist, newCardData);
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

  function deleteCard(event) {
    const target = event.target;
    const modal = target.closest('.mymodal');
    const cardID = modal.querySelector('.relevent-card-id').textContent;
    const listID = modal.querySelector('.relevent-list-id').textContent;
    MODEL.deleteCardFromAppData(cardID);

    //remove from UI
    const UiLists = document.querySelectorAll('.list-li');
    let matchingList;
    for (const list of UiLists) {
      if (list.getAttribute('unique-id') === listID) {
        matchingList = list;
      }
    }
    const cardsInMatchingList = matchingList.querySelectorAll('.main-li');
    for (const card of cardsInMatchingList) {
      if (card.getAttribute('unique-id') === cardID) {
        card.remove();
      }
    }
    // close modal
    closeEditModal();
  }

// ===== TITLES ======
  function makeListSupportTitle(newLi) {

// target all titles (spans)
    const titleElm = newLi.querySelector('.span-elm');
    titleElm.addEventListener('click', titleClickHandler);

// targets all inputs
    const titleInput = document.querySelectorAll('.list-li .title-input');

    // target all dropdown btns
    const dropDownBtn = document.querySelectorAll('.dropdown-toggle');
    for (const btn of dropDownBtn) {
      makeTheButtonSupportDelete(btn);
    }
    for (const title of titleInput) {
      // adds key down event listener and runs function
      title.addEventListener('keydown', titleInputKeyHandler);

      // adds blur event listener and runs function
      title.addEventListener('blur', titleBlurHandler);
    }
  }

  function makeTheButtonSupportDelete(btn) {
    //add event listeners to each dropdown btn
    btn.addEventListener('click', handleDropDown);

// delete list functionality
    const dropDownUl = btn.parentNode.querySelector('.dropdown-menu');
    const aElm = dropDownUl.querySelector('li a');
    aElm.addEventListener('mousedown', deleteListItem);
  }

  function handleDropDown(event) {
    //display block ul; catch ul, display it:
    const target = event.target;
    const targetParent = target.parentNode.parentNode;
    const targetUL = targetParent.querySelector('.dropdown-menu');
    toggleDropDown(targetUL);
    //
  }

  function toggleDropDown(targetList) {
    if (((targetList.style.display) === 'none') || ((!targetList.style.display))) {
      targetList.style.display = 'block';
    }
    else {
      targetList.style.display = 'none';
    }
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

  function titleClickHandler(event) {
    // if click - updates span with value and shows it


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

    MODEL.editListTitleInAppData(titleElm.textContent, listUniqueId);


    //since span is currently hidden, we need to hide the input and show the span
    target.style.display = 'none';
    titleElm.style.display = 'inline-block';
  }

  function deleteListItem(event) {
    const target = event.target;
    const liItem = target.closest('.list-li');
    const listID = liItem.getAttribute('unique-id');
    const liItemName = liItem.querySelector('span');
    const isSure = confirm(`Are you sure you want to delete ${liItemName.innerHTML} ?`);

    if (isSure === true) {
      liItem.remove();
      MODEL.removeListFromappData(listID);
    }
  }

// ========= MEMBERS SECTION ========

  function addMembers(membersList) {
// gets members names from appData, creates new lists with them

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
      MODEL.addNewMemberToAppData(newMemberId, span.textContent);
    }

    // const inputField = document.querySelector('.add-member-input');
    // inputField.placeholder = "Add New ZIBI";

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
    MODEL.deleteMemberFromAppData(memberId);
    MODEL.deleteMemberFromAppDataTasks(memberId);
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
    MODEL.saveMemberToAppData(memberId, memberInput);
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

// ==== MODAL =====
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
    const cardInAppData = MODEL.findCardByID(cardID);
    textBox.value = cardInAppData.text;

    // fill modal with checked members
    const memberInputs = modal.querySelectorAll('input');
    for (const input of memberInputs) {

      for (const member of cardInAppData.members) {
        if (input.getAttribute('unique-id') === member) {
          input.checked = true;
          // update in appData

        }
      }
    }

    // add lists to modal from appData
    const listsFromAppData = MODEL.getLists();
    const listsMenu = modal.querySelector('.select-list-menu');
    listsMenu.innerHTML = '';

    for (const list of listsFromAppData) {
      listsMenu.innerHTML += `<option value="${list.title}" unique-id="${list.id}">${list.title}</option>`;
    }

    // update modal with relevent list
    const moveOptions = modal.querySelectorAll('option');
    for (let option of moveOptions) {
      if (option.getAttribute('unique-id') === releventListSpan.textContent) {
        option.selected = 'true';
      }
    }
  }

  function addModalMembers(modal) {
    const membersFromAppData = MODEL.getMembers();
    const membersDiv = modal.querySelector('.members-checkbox');
    for (const member of membersFromAppData) {
      membersDiv.innerHTML += `<div class="checkbox">
      <label>
      <input type="checkbox" value="${member.name}" unique-id="${member.id}">${member.name}
    </label>
    </div>`;
    }
  }

  function closeEditModal() {
    const modal = document.querySelector('.mymodal');
    modal.style.display = 'none';
    const memberInputs = modal.querySelectorAll('input');
    for (const input of memberInputs) {
      input.checked = false;
    }
  }

  function saveModalChangesToAppData(event) {
    const target = event.target;
    const modal = target.closest('.mymodal');
    const cardID = modal.querySelector('.relevent-card-id').textContent;
    const listID = modal.querySelector('.relevent-list-id').textContent;
    let textBox = modal.querySelector('.text-box').value;

    // update text in appData
    MODEL.updateCardTextToAppData(textBox, cardID);

    // update checked members
    MODEL.updateCheckedMembersInAppData(modal, cardID);

    moveList(modal, cardID, listID);
    initPageByHash();
    closeEditModal();
  }

  function moveList(modal, cardID, listID) {
    const listMenu = modal.querySelectorAll('option');
    const matchingCard = MODEL.findCardByID(cardID);

    for (const option of listMenu) {

      if (option.selected === true) {

        const optionID = option.getAttribute('unique-id');
        const matchingList = MODEL.findListByID(optionID);
        const currentList = MODEL.findListByID(listID);

        if (optionID !== currentList.id) {

          // push card to selected list in AppData
          MODEL.pushCardToAppData(matchingList, matchingCard);


          // remove card from current list
          MODEL.removeCardFromListInAppData(currentList, cardID);
        }
      }
    }
  }

// ======== JSONS =======


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
    // appData.lists = listsData;
    MODEL.loadBoard(listsData);
    updateJsonState('board');
  }

  function reqMemberListener() {
    const memberDataList = JSON.parse(this.responseText);
    const listsData = memberDataList.members;
    // appData.members = listsData;
    MODEL.loadMembers(listsData);
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

// ==== LOCAL STORAGE ====


  if (localStorage.getItem('appData')) {
    // getDataFromCache();
    MODEL.loadAppData();
    initPageByHash();
    console.info('loaded from local storage');
  }
  else {
    getBoardData();
    getMembersData();
    console.info('loaded from JSONs');
  }

  const jsonsAreHere = {
    members: false,
    board: false
  };

// ==== INIT THE APP ======
  targetAllAddCardBtns();
  initTopbar();


})();
