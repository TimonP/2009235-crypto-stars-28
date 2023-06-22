import {isEscapeKey, isEnterKey} from './utils.js';
import {autocompleteModalForm} from './modal-autocomplete.js';
import {pristineBuyForm, pristineSellForm} from './modal-check.js';
import {showModalBuyHiddenMessage, showModalSellHiddenMessage} from './post-modal-form.js';

const modalSellElement = document.querySelector('.modal--sell');
const modalSellCloseElement = modalSellElement.querySelector('.modal__close-btn');
const modalSellWindow = modalSellElement.querySelector('.modal__overlay');
const modalSellForm = modalSellElement.querySelector('.modal-sell');


const modalBuyElement = document.querySelector('.modal--buy');
const modalBuyCloseElement = modalBuyElement.querySelector('.modal__close-btn');
const modalBuyWindow = modalBuyElement.querySelector('.modal__overlay');
const modalBuyForm = modalBuyElement.querySelector('.modal-buy');

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
    showModalBuyHiddenMessage();
  }
  if (counterpartyData.status === 'buyer') {
    manageOpenModalElements(modalSellElement, modalSellCloseElement, modalSellWindow);
    showModalSellHiddenMessage();
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
      modalBuyForm.reset();
      pristineBuyForm.reset();
    }

    if (modalElement.style.display !== 'none' && modalElement.classList.contains('modal--sell')) {
      manageCloseModalElements(modalSellElement, modalSellCloseElement, modalSellWindow);
      modalSellForm.reset();
      pristineSellForm.reset();
    }

    const modalErrorMessage = modalElement.querySelector('.modal__validation-message--error');
    if (modalErrorMessage) {
      modalErrorMessage.remove();
    }
    const modalSuccessMessage = modalElement.querySelector('.modal__validation-message--success');
    if (modalSuccessMessage) {
      modalSuccessMessage.remove();
    }
  });

  document.body.classList.remove('scroll-lock');
  document.removeEventListener('keydown', onDocumentKeydownEscape);
}


export {findModalOpenElements, saveСounterpartiesData, openModal};
