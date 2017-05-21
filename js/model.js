const MODEL = (function () {

  /**
   * private
   */


  let appData = {
    lists: [],
    members: []
  };

  
  /**
   * public
   */

  function removeListFromappData(listID) {
    appData.lists.forEach((item, index) => {
      if (item.id === listID) {
        appData.lists.splice(index, 1);
      }
    });
    saveToCache();
  }

  function deleteMemberFromAppData(memberId) {
    appData.members.forEach((appDataMember, index) => {
      if (appDataMember.id === memberId) {
        appData.members.splice(index, 1);
      }
    });
    saveToCache();
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
    saveToCache();
  }

  function addNewListToappData(newListObj) {
    appData.lists.push(newListObj);
    saveToCache();
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
    saveToCache();
  }

  function saveMemberToAppData(memberId, memberInput) {
    for (const appDataMember of appData.members) {
      if (appDataMember.id === memberId) {
        appDataMember.name = memberInput;
      }
    }
    saveToCache();
  }

  function addNewMemberToAppData(id, span) {
    const newMember = {
      id: id,
      name: span
    };
    appData.members.push(newMember);
    saveToCache();
  }

  function editListTitleInAppData(input, listID) {
    appData.lists.forEach((item) => {
      if (listID === item.id) {
        item.title = input;
      }
    });
    saveToCache();
  }

  function updateCardTextToAppData(textBox, cardID) {
    const appDataLists = appData.lists;
    for (const list of appDataLists) {
      for (const task of list.tasks) {
        if (task.id === cardID) {
          task.text = textBox;
        }
      }
    }
    saveToCache();
  }

  function pushCardToAppData(matchingList, matchingCard) {
    matchingList.tasks.push(matchingCard);
    saveToCache();
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
    saveToCache();
  }

  function deleteCardFromAppData(cardID) {
    appData.lists.forEach((list) => {
      list.tasks.forEach((task, index) => {
        if (task.id === cardID) {
          list.tasks.splice(index, 1);
        }
      });
    });
    saveToCache();
  }

  function getMembers() {
    return appData.members;
    saveToCache();
  }

  function getLists() {
    return appData.lists
    saveToCache();
  }

  function getTasks(data) {
    return data.tasks;
    saveToCache();
  }

  function getListID(data) {
    return data.id;
    saveToCache();
  }

  function getListTitle(data) {
    return data.title;
    saveToCache();
  }

  function getCardID (taskData) {
    return taskData.id;
    saveToCache();
  }

  function getCardText(taskData) {
    return taskData.text;
    saveToCache();
  }

  function getCardMembers(taskData) {
    return taskData.members;
    saveToCache();
  }

  function saveToCache() {
    localStorage.setItem('appData', JSON.stringify(appData));
  }

  function loadBoard(listsData) {
    appData.lists = listsData;

    saveToCache();
  }

  function loadMembers(listsData) {
    appData.members = listsData;

    saveToCache();
  }

  function loadAppData() {
    // Update appData from the data from localStorage
    appData = JSON.parse(localStorage.getItem('appData'));
  }

  function findCardByID(cardId) {
    const appDatalists = MODEL.getLists();
    for (const list of appDatalists) {
      for (const task of list.tasks)
        if (task.id === cardId) {
          return task;
        }
    }
  }

  function findListByID(listID) {
    const appDatalists = MODEL.getLists();
    for (const list of appDatalists) {
      if (list.id === listID) {
        return list
      }
    }

  }

  function removeCardFromListInAppData(currentList, cardID) {
    currentList.tasks.forEach((task, index) => {
      if (task.id === cardID) {
        currentList.tasks.splice(index, 1);
      }
    });
    saveToCache();
  }

  /**
   * Expose specific functions publicly
   */

  return  {
    removeListFromappData,
    deleteMemberFromAppData,
    deleteMemberFromAppDataTasks,
    addNewListToappData,
    addnewCardtoAppData,
    saveMemberToAppData,
    addNewMemberToAppData,
    editListTitleInAppData,
    updateCardTextToAppData,
    pushCardToAppData,
    updateCheckedMembersInAppData,
    deleteCardFromAppData,
    getMembers,
    getLists,
    getTasks,
    getListID,
    getListTitle,
    getCardID,
    getCardText,
    getCardMembers,
    saveToCache,
    loadBoard,
    loadMembers,
    loadAppData,
    findCardByID,
    findListByID,
    removeCardFromListInAppData,

  };
})();


