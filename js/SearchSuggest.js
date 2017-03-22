class SearchSuggest {
  
  constructor(props) {
    this.props = props;
    this.curIndex = 0;
    this.disableMouseover = false;
    this.outterHeight = 0;
    this.itemHeight = 0;

    this.items = [];
    
    this.render();
  }

  renderSearchBlock(inputField, searchBlock, searchSuggestList) {
    searchBlock.className = 'search_block';
    searchSuggestList.className = 'search_suggest';
    
    const parent = inputField.parentNode;
    parent.replaceChild(searchBlock, inputField);

    searchBlock.appendChild(inputField);
    searchBlock.appendChild(searchSuggestList);
  }  

  setFocusedItemIndex(newIndex, searchSuggestList) {
    if (newIndex >= 0 && newIndex < this.items.length && this.curIndex !== newIndex) {
      this.items[newIndex].className = 'item focusedItem';
      this.items[this.curIndex].className = 'item';
      
      // const this.outterHeight = parseInt(window.getComputedStyle(searchSuggestList).getPropertyValue('max-height'), 10);
      // const this.itemHeight = parseInt(window.getComputedStyle(this.items[newIndex]).getPropertyValue('height'), 10);
      const dTop = this.items[newIndex].offsetTop;
      
      
      if (dTop > (this.outterHeight + searchSuggestList.scrollTop)) {
        searchSuggestList.scrollTop = dTop - this.outterHeight;
      } else if (dTop < (this.outterHeight + searchSuggestList.scrollTop) && !(dTop > (searchSuggestList.scrollTop + this.itemHeight))) {
        this.items[newIndex].scrollIntoView();
      }

      this.curIndex = newIndex;
    }
  }

  renderDeleteButton(item, searchSuggestList) {
    if (item.querySelector('.deleteButton')) return;

    const deleteButton = document.createElement('p');
    deleteButton.className = 'deleteButton';
    deleteButton.innerHTML = '&#10060';
    deleteButton.style.display = 'none';
    
    /* 
      1. Remove item form local storage
      2. Hide delete button after removing
      3. Reorder suggested items by inserting the removed item to the bototm of the list
    */
    deleteButton.onmousedown = (e) => {
      e.stopPropagation();
      const res = window.confirm('Are you sure you want to remove the item from search history?');
      if (res) {
        window.localStorage.removeItem(item.getElementsByClassName('name')[0].innerText);
        deleteButton.style.display = 'none';
        searchSuggestList.removeChild(item);
        searchSuggestList.appendChild(item);
        this.items = searchSuggestList.childNodes;
      }
    };
    item.appendChild(deleteButton);
  }

  renderItem(data, inputField, idx, searchSuggestList) {
    const item = document.createElement('div');
    item.className = 'item';
    const name = document.createElement('div');
    name.className = 'name';
    name.innerHTML = data.name;
    const logo = document.createElement('img');
    logo.className = 'logo';
    logo.src = data.logo;

    item.appendChild(logo);
    item.appendChild(name);
    
    item.onmousedown = (e) => this.setSelectedItem(e, inputField, searchSuggestList);
    item.onmouseover = () => this.setFocusedItemIndex(idx, searchSuggestList);

    if (idx === this.curIndex) {
      item.className = 'item focusedItem';
    } else {
      item.className = 'item';
    }
    
    this.renderDeleteButton(item, searchSuggestList);

    return item;
  }
  
  rebindMouseOverEvent(searchSuggestList) {
    // var items = document.querySelectorAll(".item");
    this.items.forEach((item, idx) => {
      item.onmouseover = () => {
        this.setFocusedItemIndex(idx, searchSuggestList);
      }
    });
  }

  renderSearchSuggestList(data, searchSuggestList, inputField) {
    data['item'].forEach((d, idx) => {
      searchSuggestList.appendChild(this.renderItem(d, inputField, idx, searchSuggestList));
    });
    searchSuggestList.onmousemove = () => {
      if (this.disableMouseover) {
        this.disableMouseover = false;
        this.rebindMouseOverEvent(searchSuggestList);
      }
    }
    this.items = document.querySelectorAll(".item");
  }

  setSelectedItem(e, inputField, searchSuggestList) {
    e.preventDefault();
    const selectedItem = document.querySelector('.focusedItem');
    const inputText = selectedItem.getElementsByClassName('name')[0];
    const deleteButton = selectedItem.getElementsByClassName('deleteButton')[0]

    deleteButton.style.display = 'block';

    inputField.onblur();
    inputField.value = inputText.innerText;

    /* Save to local storage */
    if (window.localStorage !== "undefined") {
      console.log('can use local storage');
      localStorage.setItem(inputField.value, Date.now());
      // console.log('get local storage', localStorage.getItem(inputField.value));
      // console.log('local storage length', Object.keys(localStorage));

      /* Remove selected item from parent node */
      searchSuggestList.removeChild(selectedItem);

      /* Insert selected item before the first child of the searchSuggestList */
      searchSuggestList.insertBefore(selectedItem, searchSuggestList.firstChild); 

      this.curIndex = 0;
      this.items = document.querySelectorAll(".item");
    }

  }

  focusPreviousOption(e, searchSuggestList) {
    e.preventDefault();
    this.setFocusedItemIndex(this.curIndex - 1, searchSuggestList);
  }

  focusNextOption(e, searchSuggestList) {
    e.preventDefault();
    this.setFocusedItemIndex(this.curIndex + 1, searchSuggestList);
  }

  bindInputFieldEvents(inputField, searchSuggestList) {
    inputField.onfocus = () => {
      searchSuggestList.style.display = 'block';
    }
    inputField.onblur = () => {
      searchSuggestList.style.display = 'none';
    }
    inputField.onkeydown = (e) => {
      switch (e.keyCode) {
        case 13: // enter
          this.setSelectedItem(e, inputField, searchSuggestList);
          break;
        case 38: // up
          this.focusPreviousOption(e, searchSuggestList);
          break;
        case 40: // down
          this.focusNextOption(e, searchSuggestList);
          break;
        default:
          inputField.onfocus();
      }
    }
    inputField.onkeyup = (e) => {
      const filter = inputField.value.toUpperCase();

      // var this.items = document.querySelectorAll(".item");
      let updatedFocusItemIdex = false;

      /* 
        remove mouseover event while interacting with up down key
        (up down key would cause scroll, and scroll will cause mouse over to particular item)
      */
      if (!this.disableMouseover) {
        console.log('disable mouse over');
        this.items.forEach((item) => {
          item.onmouseover = null;
          this.disableMouseover = true;
        });
      }

      this.items.forEach((item, idx) => {
        const name = item.querySelector('.name').innerText.toUpperCase();
        if (name.indexOf(filter) === -1) {
          item.style.display = "none";
        } else {
          item.style.display = "flex";
          if ([13, 38, 40].indexOf(e.keyCode) === -1 && !updatedFocusItemIdex) {
            updatedFocusItemIdex = true;
            this.setFocusedItemIndex(idx, searchSuggestList);
          }
        }
      });
    }
  }

  render() {
    const inputField = this.props.el;
    const data = this.props.data;

    const searchBlock = document.createElement('div');
    const searchSuggestList = document.createElement('div');

    this.renderSearchBlock(inputField, searchBlock, searchSuggestList);
    this.renderSearchSuggestList(data, searchSuggestList, inputField);

    this.outterHeight = parseInt(window.getComputedStyle(searchSuggestList).getPropertyValue('max-height'), 10);
    this.itemHeight = parseInt(window.getComputedStyle(this.items && this.items[0]).getPropertyValue('height'), 10);

    this.bindInputFieldEvents(inputField, searchSuggestList);
  }

}
