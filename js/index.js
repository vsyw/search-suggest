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

function setFocusedItemIndex(newIndex) {
  console.log('inside');
  var results = document.querySelectorAll(".item");
  if (newIndex >= 0 && newIndex < results.length && curIndex !== newIndex) {
    console.log('///////', newIndex, curIndex);
    results[newIndex].className = 'item focusedItem';
    results[curIndex].className = 'item';
    curIndex = newIndex;
    // console.log(curIndex);
  }
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
  item.onmousedown = function(e) {
    e.preventDefault();
    inputField.value = data.name;
    inputField.onblur();
  };
  item.onmouseover = function(e) {
    setFocusedItemIndex(idx);
  }
  if (idx === curIndex) {
    item.className += ' focusedItem';
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
}

function focusPreviousOption(e) {
  e.preventDefault();
  console.log('fuck');
  setFocusedItemIndex(curIndex - 1);
}

function focusNextOption(e) {
  e.preventDefault();
  setFocusedItemIndex(curIndex + 1);
}

function bindInputEvent(inputField, list) {
  inputField.onfocus = function() {
    list.style.display = 'block';
  }
  inputField.onblur = function() {
    list.style.display = 'none';
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

  // var stringValue = inputField.value;
  inputField.onkeyup = function() {
    if (inputField.value === 0) {
      setFocusedItemIndex(0);
    }
    var filter = this.value.toUpperCase();
    // console.log(inputField.value);

    var results = document.querySelectorAll(".item");

    // var updatedFocusItemIdex = false;

    results.forEach(function(item, idx) {
      var name = item.querySelector('.name').innerText.toUpperCase();
      if (name.indexOf(filter) === -1) {
        item.style.display = "none";
      } else {
        item.style.display = "flex";
        // if (!updatedFocusItemIdex) {
        //   updatedFocusItemIdex = true;
        //   focusedItemIndex = idx;
        // }
        // if (idx === focusedItemIndex) {
        //   item.className += ' focusedItem';
        // } else {
        //   item.className = 'item';
        // }
      }
    });
  }
}

function init() {
  var list = document.querySelector(".search_suggest");
  var inputField = document.getElementById('search_input');
  
  bindInputEvent(inputField, list);
  
  data['item'].forEach((d, idx) => {
    list.appendChild(renderItem(d, inputField, idx));
  });
}
window.onload = init;