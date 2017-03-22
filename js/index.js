function fetchData() {
  var myHeaders = new Headers();

  var myInit = { method: 'GET',
                 headers: myHeaders,
                 mode: 'no-cors',
                 cache: 'default' };

  fetch('https://line.me/en/family-apps', myInit)
  .then(function(response) {
      console.log('res');
  });
}

var data = {
  total: 13,
  item: [
    {
      name: 'B612',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/b612_190.png'
    },
    {
      name: 'LOOKS',
      logo: 'https://d.line-scdn.net/stf/line-lp/line_looks_190x190.png'
    },
    {
      name: 'LINE MAN',
      logo: 'https://d.line-scdn.net/stf/line-lp/line_android_190x190_1111.png'
    },
    {
      name: 'LINE HERE',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/lp_here_appicon_190x190.png'
    },
    {
      name: 'EMOJI LINE',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/190X190_line_me.png'
    },
    {
      name: 'LINE Moments',
      logo: 'https://d.line-scdn.net/stf/line-lp/iOS_appcion_190-190.png'
    },
    {
      name: 'LINE@',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/lineat_96.png'
    },
    {
      name: 'LINE TV',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/linelogo_96x96.png'
    },
    {
      name: 'LINE Camera',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/linecamera_icon_96.png'
    },
  ]
}

var focusedItemIndex = 0;
var curIndex = 0;
var disableMouseover = false;

function setFocusedItemIndex(newIndex) {
  var items = document.querySelectorAll(".item");
  if (newIndex >= 0 && newIndex < items.length && curIndex !== newIndex) {
    items[newIndex].className = 'item focusedItem';
    items[curIndex].className = 'item';
    
    var searchSuggestList = document.querySelector(".search_suggest");
    var outterHeight = parseInt(window.getComputedStyle(searchSuggestList).getPropertyValue('max-height'), 10);
    var itemHeight = parseInt(window.getComputedStyle(items[newIndex]).getPropertyValue('height'), 10);
    var dTop = items[newIndex].offsetTop;
    
    // console.log('dTop', dTop, 'outterHeight', outterHeight, 'searchSuggestList.scrollTop', searchSuggestList.scrollTop);
    
    if (dTop > (outterHeight + searchSuggestList.scrollTop)) {
      searchSuggestList.scrollTop = dTop - outterHeight;
    } else if (dTop < (outterHeight + searchSuggestList.scrollTop) && !(dTop > (searchSuggestList.scrollTop + itemHeight))) {
      // searchSuggestList.scrollTop = dTop - outterHeight;
      items[newIndex].scrollIntoView();
    }

    curIndex = newIndex;
  }
}

function rebindMouseOverEvent() {
  var items = document.querySelectorAll(".item");
  items.forEach(function(item, idx) {
    item.onmouseover = function() {
      setFocusedItemIndex(idx);
    }
  });
}

function renderItem(data, inputField, idx) {
  var item = document.createElement('div');
  item.className = 'item';
  var name = document.createElement('div');
  name.className = 'name';
  name.innerHTML = data.name;
  var logo = document.createElement('img');
  logo.className = 'logo';
  logo.src = data.logo;
  item.appendChild(logo);
  item.appendChild(name);
  item.onmousedown = setSelectedItem;
  item.onmouseover = function(e) {
    console.log('mouse over', idx);
    setFocusedItemIndex(idx);
  }

  if (idx === curIndex) {
    item.className = 'item focusedItem';
  } else {
    item.className = 'item';
  }
  return item;
}

function setSelectedItem(e) {
  e.preventDefault();
  var inputField = document.getElementById('search_input');
  var selectedItem = document.querySelector('.focusedItem');
  var inputText = selectedItem.getElementsByClassName('name')[0];
  inputField.onblur();
  console.log(inputText.innerText);
  inputField.value = inputText.innerText;

  /* Save to local storage */
  if (window.localStorage !== "undefined") {
    console.log('can use local storage');
    localStorage.setItem(inputField.value, Date.now());
    console.log('get local storage', localStorage.getItem(inputField.value));
    console.log('local storage length', Object.keys(localStorage));

    /* Remove selected item from parent node */
    var searchSuggestList = document.querySelector(".search_suggest");
    searchSuggestList.removeChild(selectedItem);

    /* Insert selected item before the first child of the searchSuggestList */
    searchSuggestList.insertBefore(selectedItem, searchSuggestList.childNodes[0]); 
  }

}

function focusPreviousOption(e) {
  e.preventDefault();
  setFocusedItemIndex(curIndex - 1);
}

function focusNextOption(e) {
  e.preventDefault();
  setFocusedItemIndex(curIndex + 1);
}

function bindInputFieldEvents(inputField, searchSuggestList) {
  inputField.onfocus = function() {
    searchSuggestList.style.display = 'block';
  }
  inputField.onblur = function() {
    searchSuggestList.style.display = 'none';
  }
  inputField.onkeydown = function(e) {
    switch (e.keyCode) {
      case 13: // enter
        setSelectedItem(e);
        break;
      case 38: // up
        focusPreviousOption(e);
        break;
      case 40: // down
        focusNextOption(e);
        break;
      default:
        inputField.onfocus();
    }
  }

  inputField.onkeyup = function(e) {
    var filter = this.value.toUpperCase();
    var items = document.querySelectorAll(".item");
    var updatedFocusItemIdex = false;

    /* 
      remove mouseover event while interacting with up down key
      (up down key would cause scroll, and scroll will cause mouse over to particular item)
    */
    if (!disableMouseover) {
      console.log('disable mouse over');
      items.forEach(function(item) {
        item.onmouseover = null;
        disableMouseover = true;
      });
    }

    items.forEach(function(item, idx) {
      var name = item.querySelector('.name').innerText.toUpperCase();
      if (name.indexOf(filter) === -1) {
        item.style.display = "none";
      } else {
        item.style.display = "flex";
        if ([13, 38, 40].indexOf(e.keyCode) === -1 && !updatedFocusItemIdex) {
          updatedFocusItemIdex = true;
          setFocusedItemIndex(idx);
        }
      }
    });
  }
}

function init() {
  // var searchSuggestList = document.querySelector(".search_suggest");
  var searchBlock = document.createElement('div');
  searchBlock.className = 'search_block';

  var searchSuggestList = document.createElement('div');
  searchSuggestList.className = 'search_suggest';
  
  var inputField = document.getElementById('search_input');
  
  var parent = inputField.parentNode;
  parent.replaceChild(searchBlock, inputField);

  searchBlock.appendChild(inputField);
  searchBlock.appendChild(searchSuggestList);



  searchSuggestList.onmousemove = function() {
    if (disableMouseover) {
      disableMouseover = false;
      rebindMouseOverEvent();
    }
  }

  bindInputFieldEvents(inputField, searchSuggestList);
  
  data['item'].forEach((d, idx) => {
    searchSuggestList.appendChild(renderItem(d, inputField, idx));
  });

}
window.onload = init;

