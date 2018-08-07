//Storage container - for Local Storage
const StorageCtrl = (function() {

  //public methods
  return {
    storeItem: function(item) {
      let items;
      //ls can hold only strings, before we put smth in we have to turn it into a str with JSON.stringify and then to pull it out, we have to turn it into an object with JSON.parse

      //check if any items in ls , if nothing we take the empty array, push the new item to it, and set it to ls
      if (localStorage.getItem('items') === null) {
        let items = [];
        //push new item
        items.push(item);
        //set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        //if smth, we pull it out, turn it back into an object, so we can push onto it, and reset ls
        //get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));
        //push new item
        items.push(item);
        //reset ls
        localStorage.setItem('items', JSON.stringify(items));
      }

    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));

    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();

//Item controller -for local data, start with it, iife
const ItemCtrl = (function() {
  //Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //data structure / state
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  //return - will be public
  return {

    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      //generate an id  auto increment
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //caloriesto number
      calories = parseInt(calories);

      //create new item
      newItem = new Item(ID, name, calories);

      //add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      //loop through items
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      //calories to number
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      //get ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      //get index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      //loop through items to get the cal and add them
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories; // => total = total + item.calories
      });
      //set total cal in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  }

})();

//UI controller - showing/hiding/getting input
const UICtrl = (function() {

  //creating object that holds the ids, to make it easier to use them
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#meal',
    itemCaloriesInput: '#calories',
    totalCalories: '.total-calories'
  }

  //public methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(function(item) {
        html += `<li id="item-${item.id}" class="list-group-item">
        <strong>${item.name}</strong> <em>${item.calories} Calories</em><a href="#" class="float-right"><i class="edit-item fa fa-pencil"></i></a></li>`;
      });
      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      //create li element
      const li = document.createElement('li');
      //add class
      li.className = 'list-group-item';
      //add id
      li.id = `item-${item.id}`;

      //add html
      li.innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em><a href="#" class="float-right"><i class="edit-item fa fa-pencil"></i></a>`;
      //insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em><a href="#" class="float-right"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deletListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(item) {
        item.remove();
      })
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    showEditState: function() {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    //creating public method that will allow us to get the selectors
    getSelectors: function() {
      return UISelectors;
    }
  }
})();

//App controller - everything meets here + event listeners
const App = (function(ItemCtrl, StorageCtrl, UIctrl) {

  //load event listeners
  const loadEventListeners = function() {
    //get UI selectors, so we can use them in app ctrl
    const UISelectors = UICtrl.getSelectors();

    //add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //disable submit on enter
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    })

    //edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);


  }

  //add item submit
  const itemAddSubmit = function(e) {
    //get form input from ui cntrl
    const input = UICtrl.getItemInput();

    //check for name and Calories
    if (input.name !== '' && input.calories !== '') {
      //add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //add item to ui list
      UICtrl.addListItem(newItem);

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //add total cal to ui
      UICtrl.showTotalCalories(totalCalories);

      //store inputs in ls
      StorageCtrl.storeItem(newItem);

      //clear fields
      UICtrl.clearInput();

    }
    e.preventDefault();
  }

  //edit item click
  const itemEditClick = function(e) {
    if (e.target.classList.contains('edit-item')) {
      //get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      //that gives us item-id we need id, break into an array on the dash -
      const listIdArray = listId.split('-');
      //get the id, it is on position 1
      const id = parseInt(listIdArray[1]);

      //get item
      const itemToEdit = ItemCtrl.getItemById(id);

      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //add item to form
      UICtrl.addItemToForm();

    }
    e.preventDefault();
  }

  //item update submit
  const itemUpdateSubmit = function(e) {
    //get item input
    const input = UICtrl.getItemInput();

    //update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //update ui
    UICtrl.updateListItem(updatedItem);

    //get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total cal to ui
    UICtrl.showTotalCalories(totalCalories);

    //update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //item delete submit
  const itemDeleteSubmit = function(e) {
    //get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //delete from ui
    UIctrl.deletListItem(currentItem.id);

    //get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total cal to ui
    UICtrl.showTotalCalories(totalCalories);

    //delete from ls
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //clear items event
  const clearAllItemsClick = function() {
    //delete all items from data structure
    ItemCtrl.clearAllItems();

    //get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //add total cal to ui
    UICtrl.showTotalCalories(totalCalories);

    //remove from ui
    UICtrl.removeItems();

    //clear from local storage
    StorageCtrl.clearItemsFromStorage();
  }

  //Public methods - everything we need to run when the application loads
  return {
    init: function() {
      //clear edin state / set initial state
      UICtrl.clearEditState();
      //fetch items from data structure
      const items = ItemCtrl.getItems();

      //populate list with items
      UICtrl.populateItemList(items);

      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //add total cal to ui
      UICtrl.showTotalCalories(totalCalories);

      //call load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

//initialize app
App.init();
