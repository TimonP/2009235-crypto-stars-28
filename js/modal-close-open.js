import {isEscapeKey, isEnterKey} from './utils.js';
import {autocompleteModalForm} from './modal-check-and-autocomplete.js';

const modalSellElement = document.querySelector('.modal--sell');
const modalSellCloseElement = modalSellElement.querySelector('.modal__close-btn');
const modalSellWindow = modalSellElement.querySelector('.modal__overlay');


const modalBuyElement = document.querySelector('.modal--buy');
const modalBuyCloseElement = modalBuyElement.querySelector('.modal__close-btn');
const modalBuyWindow = modalBuyElement.querySelector('.modal__overlay');

const modalElements = document.querySelectorAll('.modal');
const tableModalOpenElementList = document.querySelector('.users-list__table-body');


let savedСounterpartiesData = [];

const saveСounterpartiesData = (data) => {
  savedСounterpartiesData = data;
};


const onCloseElementKeydownEscape = (evt) => {
  if (isEnterKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const onDocumentKeydownEscape = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const onOutsideModalWindow = (evt) => {
  if (evt.target === evt.currentTarget) {
    closeModal();
  }
};

const onCloseButton = (evt) => {
  evt.preventDefault();
  closeModal();
};

function listenModalOpenElement (item) {
  item.addEventListener('click', (evt) => {
    evt.preventDefault();
    const counterpartyID = evt.target.closest('.users-list__table-row').dataset.counterpartyId;
    openModal(counterpartyID);
  });

  item.addEventListener('keydown', (evt) => {
    evt.preventDefault();
    if (isEnterKey(evt)) {
      const counterpartyID = evt.target.closest('.users-list__table-row').dataset.counterpartyId;
      openModal(counterpartyID);
    }
  });
}

function findModalOpenElements () {
  const tableModalOpenElements = tableModalOpenElementList.querySelectorAll('.btn--greenborder');
  for (let i = tableModalOpenElements.length - 1; i >= 0; i--) {
    listenModalOpenElement(tableModalOpenElements[i]);
  }
}

function manageOpenModalElements (modalElement, modalCloseElement, modalWindow) {
  modalElement.style.display = null;
  modalCloseElement.addEventListener('click', onCloseButton);
  modalCloseElement.addEventListener('click', onCloseElementKeydownEscape);
  modalWindow.addEventListener('click', onOutsideModalWindow);
}

function openModal (id) {
  const counterpartyData = savedСounterpartiesData.find((savedCounterpartyData) => savedCounterpartyData.id === id);
  autocompleteModalForm(counterpartyData);

  if (counterpartyData.status === 'seller') {
    manageOpenModalElements(modalBuyElement, modalBuyCloseElement, modalBuyWindow);
  }
  if (counterpartyData.status === 'buyer') {
    manageOpenModalElements(modalSellElement, modalSellCloseElement, modalSellWindow);
  }

  document.body.classList.add('scroll-lock');
  document.addEventListener('keydown', onDocumentKeydownEscape);
}


function manageCloseModalElements (modalElement, modalCloseElement, modalWindow) {
  modalElement.style.display = 'none';
  modalCloseElement.removeEventListener('click', onCloseButton);
  modalCloseElement.removeEventListener('click', onCloseElementKeydownEscape);
  modalWindow.removeEventListener('click', onOutsideModalWindow);
}

function closeModal () {
  modalElements.forEach((modalElement) => {
    if (modalElement.style.display !== 'none' && modalElement.classList.contains('modal--buy')) {
      manageCloseModalElements(modalBuyElement, modalBuyCloseElement, modalBuyWindow);
    }

    if (modalElement.style.display !== 'none' && modalElement.classList.contains('modal--sell')) {
      manageCloseModalElements(modalSellElement, modalSellCloseElement, modalSellWindow);
    }
  });

  document.body.classList.remove('scroll-lock');
  document.removeEventListener('keydown', onDocumentKeydownEscape);
}


export {findModalOpenElements, saveСounterpartiesData, openModal};
