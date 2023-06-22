import {resetMapSize} from './add-map.js';

const listTypeButtonsWrapper = document.querySelector('.tabs--toggle-list-map');
const listTypeButtons = listTypeButtonsWrapper.querySelectorAll('.tabs__control');
const tableHeaderDiv = document.querySelector('.users-list');
const mapDiv = document.querySelector('.container--map');
const noResultsMessage = document.querySelector('.container--lightbackground');

let noResultsMessagAdded;

const saveNoResultsMessagAdded = (data) => {
  noResultsMessagAdded = data;
};

const toggleActiveClass = () => listTypeButtons.forEach((listTypeButton) => listTypeButton.classList.toggle('is-active'));

const listenListTypeButtons = (listTypeButton) => {
  listTypeButton.addEventListener('click', (evt) => {
    toggleActiveClass();

    if (evt.target.id === 'show-list') {
      tableHeaderDiv.style.display = null;
      mapDiv.style.display = 'none';

      if (noResultsMessagAdded) {
        noResultsMessage.style.display = null;
      }
    }

    if (evt.target.id === 'show-map') {
      tableHeaderDiv.style.display = 'none';
      mapDiv.style.display = null;
      resetMapSize();

      if (noResultsMessagAdded) {
        noResultsMessage.style.display = 'none';
      }
    }
  });
};

const beginListenListTypeButtons = () => {
  for (let i = 0; i < listTypeButtons.length; i++) {
    listenListTypeButtons(listTypeButtons[i]);
  }
};

export {beginListenListTypeButtons, saveNoResultsMessagAdded};
