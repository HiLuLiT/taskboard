

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


function deleteCardFromAppData(event) {
  const target = event.target;
  const modal = target.closest('.mymodal');
  const cardID = modal.querySelector('.relevent-card-id').textContent;
  console.info(cardID);

  appData.lists.forEach((list) => {
    list.tasks.forEach((task, index) => {
      if (task.id === cardID) {
        list.tasks.splice(index, 1);
      }
    });
  });
}

function getMembers() {
  return appData.members;
}

function getLists() {
  return appData.lists
}