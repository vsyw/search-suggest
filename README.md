Search-Suggest
==============

A pure JavaScript implementation of a suggest plugin for easier
input search

## Demo & Examples
Live demo: [iwantooxxoox.github.io/search-suggest](https://iwantooxxoox.github.io/search-suggest/)
For local browser: Open up the `index.html` file.

## Usage
Include the JavaScript file `SearchSuggest.js` and the stylesheet in the HTML file.

##### index.html:
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="PATH_TO/index.css">
  <script src="PATH_TO/SearchSuggest.js"></script>
</head>
<body>
  <div class="search">
    <span>input service name:&nbsp</span>
    <input type="text" id="search_input">
  </div>
</body>
</html>
```

##### JS code:
```javascript
const props = {
    el: document.querySelector('#search_input'),
    data: data
};

const searchSuggest = new SearchSuggest(props);

```

The `props` should be provided as an `Object`.  

The `el` property should be set to a CSS slector (#id) which must be as same as the `#id` you set for the `<input>` tag in the html file.  

The `data` property should be an `Object` with the format as below, the `item` value is used to render options.  

```javascript
{
  total: 13,
  item: [
    {
      name: 'B612',
      logo: 'https://d.line-scdn.net/stf/line-lp/family/en/b612_190.png'
    },
    ...
}
```
### Mutiple input attach
##### index.html
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="PATH_TO/index.css">
  <script src="PATH_TO/SearchSuggest.js"></script>
</head>
<body>
  <div class="search">
    <span>input service name:&nbsp</span>
    <input type="text" id="search_input">
    <span>input service name:&nbsp</span>
    <input type="text" id="search_input2">
  </div>
</body>
</html>
```

##### JS code
```javascript
const props = {
    el: document.querySelector('#search_input'),
    data: data
};
const props2 = {
    el: document.querySelector('#search_input2'),
    data: data
};

const searchSuggest = new SearchSuggest(props);
const searchSuggest2 = new SearchSuggest(props2);
```

## Features
- Be able to attach to multiple input by js.
- Support both keyboard and mouse selecting with no confict when using both
- Save input history to localstorage when suggested item is selected
- Dispaly history items with higher priority
-  Be able to delete specific search history item
- Supports mobile browsers, such as iOS Safari

## Methods in SearchSuggest
##### Constructor:
- Constructor()
##### Main method:
- render()
##### Render methods:
- renderSearchBlock()
- renderSearchSuggestList()
- renderItem()
- renderDeleteButton()
##### Utility methods
- setFocusedItemIndex()
- setSelectedItem()
- focusPreviousOption()
- focusNextOption()
##### Event binding methods
- bindInputFieldEvents()
- rebindMouseOverEvent()







