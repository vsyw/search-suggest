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

function renderItem(data, inputField) {
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
  item.onmousedown = function() {
    console.log('fuck');
    inputField.value = data.name;
  };
  return item;
}

function init() {  
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
  var list = document.querySelector(".search_suggest");

  var inputField = document.getElementById('search_input');
  inputField.onfocus = function() {
    console.log('focus');
    list.style.display = 'block';
  }
  inputField.onblur = function() {
    console.log('onblur');
    list.style.display = 'none';
  }


  // var stringValue = inputField.value;
  inputField.onkeyup = function() {
    var filter = this.value.toUpperCase();
    // console.log(inputField.value);

    var results = document.querySelectorAll(".item");

    results.forEach(function(item) {
      var name = item.querySelector('.name').innerText.toUpperCase();
      if (name.indexOf(filter) === -1) {
        item.style.display = "none";
      } else {
        item.style.display = "flex";
      }
      // console.log('hihi', item.querySelector('.name').innerText.toUpperCase());
    });
  }
  
  
  data['item'].forEach(d => {
    list.appendChild(renderItem(d, inputField));
  });
}
window.onload = init;