// Adds New Lists

initButtonsPage();

const addList = document.querySelector('.add-li');
// get a reference to the element, before we want to insert the element
const refLi = document.querySelector('.add-li');
// Get a reference to the parent element
const dadUl = document.querySelector('.flex-wrap');


addList.addEventListener('click', function () {
  let newLi = document.createElement('li');
  newLi.className = "card-li";
  newLi.innerHTML = `
     <div class="panel panel-default">
        <div class="panel-heading">
          <span class="span-elm panel-title li-title" >New List</span >
          <input type="text">
        </div>
        <div class="panel-body">
          <ul class="main-ul">
     
          </ul>
        </div>
        <div class="panel-footer">
          <button class="add-card-btn">Add a Card...</button>
        </div>
      </div>`;
  dadUl.insertBefore(newLi, refLi);
  initialListTitles(newLi);
  const addBtn = newLi.querySelector('.add-card-btn');
  handleAddingCardEvent(addBtn);
});


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
      inputElm.focus ();
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
    })

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

// const father = e.target.parentNode;
// const newChild = document.createElement('input');
// // newChild.className = ""
// newChild.value = header.textContent;
// // newChild.focus ();
// // newChild.setSelectionRange(0, newChild.value.length);
// father.replaceChild(newChild, header);

//
//   });
// }
initialListTitles();
