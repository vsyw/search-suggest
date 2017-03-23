function init() {
  fetchMock()
    .then((data) => {
      const searchSuggest = new SearchSuggest({
        el: document.querySelector('#search_input'),
        data: data
      });
    });
}

window.onload = init;