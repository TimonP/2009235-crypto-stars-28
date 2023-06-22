import {debounce} from './utils.js';
import {findModalOpenElements} from './modal-close-open.js';
import {addCounterpartiesList} from './add-counterparties-list.js';
import {createPoints} from './add-map.js';
import {saveNoResultsMessagAdded} from './toogle-list-map.js';

const RENDER_DELAY = 500;

const transactionTypeButtonsWrapper = document.querySelector('.tabs--toggle-buy-sell');
const transactionTypeButtons = transactionTypeButtonsWrapper.querySelectorAll('.tabs__control');
const counterpartyVerifiedCheckbox = document.querySelector('#checked-users');
const showTableButton = document.querySelector('#show-list');
const tableList = document.querySelector('.users-list__table-body');
const noResultsMessage = document.querySelector('.container--lightbackground');

let transactionType = transactionTypeButtonsWrapper.querySelector('.is-active').id;
let savedСounterpartiesDataSort = [];

const saveСounterpartiesDataSort = (data) => {
  savedСounterpartiesDataSort = data;
};

const startSort = () => {
  tableList.innerHTML = '';
  noResultsMessage.style.display = 'none';

  let savedСounterpartiesData = savedСounterpartiesDataSort;

  if (transactionType === 'buy') {
    savedСounterpartiesData = savedСounterpartiesData.filter((counterpartyData) => counterpartyData.status === 'seller');
  } else if (transactionType === 'sell') {
    savedСounterpartiesData = savedСounterpartiesData.filter((counterpartyData) => counterpartyData.status === 'buyer');
  }

  if (counterpartyVerifiedCheckbox.checked) {
    savedСounterpartiesData = savedСounterpartiesData.filter((counterpartyData) => counterpartyData.isVerified);
  }

  createPoints(savedСounterpartiesData);
  addCounterpartiesList(savedСounterpartiesData);

  if (savedСounterpartiesData.length !== 0) {
    findModalOpenElements();
    saveNoResultsMessagAdded(false);
  } else {
    if (showTableButton.classList.contains('is-active')) {
      noResultsMessage.style.display = null;
    }
    saveNoResultsMessagAdded(true);
  }
};


const toggleActiveClass = () => transactionTypeButtons.forEach((transactionTypeButton) => transactionTypeButton.classList.toggle('is-active'));

const debounceSort = debounce(startSort, RENDER_DELAY);

const listenTransactionTypeButtons = (transactionTypeButton) => {
  transactionTypeButton.addEventListener('click', (evt) => {
    toggleActiveClass();
    transactionType = evt.target.id;
    debounceSort();
    findModalOpenElements();
  });
};

const onChangeCounterpartyVerifiedCheckbox = () => {
  debounceSort();
  findModalOpenElements();
};

const beginListenFilterButtons = () => {
  for (let i = 0; i < transactionTypeButtons.length; i++) {
    listenTransactionTypeButtons(transactionTypeButtons[i]);
    counterpartyVerifiedCheckbox.addEventListener('change', onChangeCounterpartyVerifiedCheckbox);
  }
};


export {saveСounterpartiesDataSort, beginListenFilterButtons, startSort};
