(function () {

  /**
   * VIEW ------> UI Manipulation
   */

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
      // stop the function otherwise it will keep on running and the listener will call the function again
      return;
    }

    const topbar = document.querySelector('.navbar > ul');

    const currentActive = topbar.querySelector('.active');
    let targetLi;

    currentActive.classList.remove('active');

    if (hash === '#members') {
      initPageByMembers();
      targetLi = document.querySelector(hash);
    }

    if (hash === '#board') {
      initPageByBoard();
      targetLi = document.querySelector(hash);
    }

    targetLi.classList.add('active');
  }

  function initPageByMembers() {

    // Build Members Skeleton
    const memberTemplate = `<section class="members-section">
  <h2 class="members-header">Taskboard Members</h2>
  <ul class="list-group">

  </ul>
</section>`;

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

    for (const list of MODEL.getLists()) {
      addNewList(list);
    }
    addListHandler();

    const modal = document.querySelector('.modal');

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeEditModal);
    const closeX = modal.querySelector('.close-x');
    closeX.addEventListener('click', closeEditModal);

    const saveBtn = modal.querySelector('.save-btn');
    saveBtn.addEventListener('click', saveModalChangesToAppData);

    addModalMembers(modal);

    const deleteBtn = modal.querySelector('.delete-card');
    deleteBtn.addEventListener('click', deleteCard);
  }

//====== LISTS =====

  function addNewList(data) {
    // getting board lists data from appData, creates new <li>

    const dadUl = document.querySelector('.lists-wrap');
    const addList = document.querySelector('.add-li');

    let newLi = document.createElement('li');
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

    dadUl.insertBefore(newLi, addList);
    makeListSupportTitle(newLi);

    const addBtn = newLi.querySelector('.add-card-btn');
    handleAddingCardEvent(addBtn);

    const dropDownBtn = newLi.querySelector('.dropdown-toggle');
    makeTheButtonSupportDelete(dropDownBtn);

    const listTitle = newLi.querySelector('.span-elm');

    if (data !== undefined && !data.type) {
// ========== if there is appData data ========

      newLi.setAttribute('unique-id', MODEL.getListID(data));
      const dataTitle = MODEL.getListTitle(data);
      listTitle.innerHTML = dataTitle;
      const mainUl = newLi.querySelector('.main-ul');
      const taskData = MODEL.getTasks(data);

      // create cards for every list from appData
      for (const data of taskData) {
        addCard(mainUl, data);
      }
    }
    else {
      // ====== if it's new list (no incoming data from appData) ==========

      const newListObj = {
        tasks: [],
        title: `New List`,
        id: uuid()
      };

      newLi.setAttribute('unique-id', newListObj.id);
      MODEL.addNewListToappData(newListObj);
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

    button.addEventListener('click', function (e) {
      const list = e.target.parentNode.parentNode;
      const ul = list.querySelector('.main-ul');
      addCard(ul);
    });
  }

  function addCard(cardslist, taskData) {
//creates new card <li> with class & content & EDIT BTN & assigned members initials

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

      newCardElm.setAttribute('unique-id', MODEL.getCardID(taskData));
      cardTextSpan.textContent = MODEL.getCardText(taskData);
      const membersFromAppDataLists = MODEL.getCardMembers(taskData);

      for (const memberID of membersFromAppDataLists) {
        let newName;
        const membersFromAppDataMembers = MODEL.getMembers();
        for (const appDataMember of membersFromAppDataMembers) {

          if (appDataMember.id === memberID) {
            newName = appDataMember.name;
          }
        }

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
    closeEditModal();
  }

// ===== TITLES ======
  function makeListSupportTitle(newLi) {

    const titleElm = newLi.querySelector('.span-elm');
    titleElm.addEventListener('click', titleClickHandler);
    const titleInput = document.querySelectorAll('.list-li .title-input');
    const dropDownBtn = document.querySelectorAll('.dropdown-toggle');

    for (const btn of dropDownBtn) {
      makeTheButtonSupportDelete(btn);
    }

    for (const title of titleInput) {
      title.addEventListener('keydown', titleInputKeyHandler);
      title.addEventListener('blur', titleBlurHandler);
    }
  }

  function makeTheButtonSupportDelete(btn) {
    //add event listeners to each dropdown btn
    btn.addEventListener('click', handleDropDown);

    const dropDownUl = btn.parentNode.querySelector('.dropdown-menu');
    const aElm = dropDownUl.querySelector('li a');
    aElm.addEventListener('mousedown', deleteListItem);
  }

  function handleDropDown(event) {
    const target = event.target;
    const targetParent = target.parentNode.parentNode;
    const targetUL = targetParent.querySelector('.dropdown-menu');
    toggleDropDown(targetUL);
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

    let target = event.target;
    const inputElm = target.parentNode.querySelector('.title-input');
    target.style.display = 'none';

    // show input's content &  focus
    inputElm.style.display = 'inline-block';
    inputElm.value = target.textContent;
    inputElm.focus();
  }

  function titleChangeHandler(target) {
    const value = target.value;
    const titleElm = target.parentNode.querySelector('span');
    titleElm.textContent = value;

    // ===== update appData
    const listId = titleElm.closest('li');
    const listUniqueId = listId.getAttribute('unique-id');

    MODEL.editListTitleInAppData(titleElm.textContent, listUniqueId);
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

    const newMember = wrapUl.insertBefore(newMemberLi, addMemberListItem);

    const editButton = newMember.querySelector('.edit-member');
    editButton.addEventListener('click', handleEditMemberMode);

    const cancelBtn = newMember.querySelector('.cancel-edit');
    cancelBtn.addEventListener('click', handleCancelEvent);

    const saveBtn = newMember.querySelector('.save-btn');
    saveBtn.addEventListener('click', handleSaveMember);

    const deleteMember = newMember.querySelector('.delete-member');
    deleteMember.addEventListener('click', handleDeleteMember);

  }

  function handleDeleteMember(event) {
    const target = event.target;
    const memberLi = target.closest('li');
    const memberId = memberLi.getAttribute('unique-id');
    memberLi.remove();
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
    const target = event.target;

    const memberLi = target.closest('li');
    const inputField = memberLi.querySelector('input');
    memberLi.classList.toggle('edit-mode');
    inputField.focus();
  }

// ==== MODAL =====
  function showEditModal(event) {
    const modal = document.querySelector('.mymodal');
    modal.style.display = 'block';

    // target card id & list id and insert it to modal
    let target = event.target;
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

    MODEL.updateCardTextToAppData(textBox, cardID);
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
    jsonsAreHere[jName] = true;

    if (jsonsAreHere.members === true && jsonsAreHere.board === true) {
      initPageByHash();
    }
  }

  function reqBoardListener() {
    const localDataList = JSON.parse(this.responseText);
    const listsData = localDataList.board;
    MODEL.loadBoard(listsData);
    updateJsonState('board');
  }

  function reqMemberListener() {
    const memberDataList = JSON.parse(this.responseText);
    const listsData = memberDataList.members;
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
