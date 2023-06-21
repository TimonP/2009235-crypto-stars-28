import {pristineBuyForm, pristineSellForm} from './modal-check.js';
import {sendData} from './api.js';

const SubmitButtonText = {
  IDLE: 'Обменять',
  SENDING: 'Обменивается...'
};

const modalBuyElement = document.querySelector('.modal--buy');
const modalBuyForm = modalBuyElement.querySelector('.modal-buy');
const modalBuyPaymentWrapper = modalBuyForm.querySelector('.modal__container--payment');
const modalBuyErrorMessage = modalBuyPaymentWrapper.querySelector('.modal__validation-message--error');
const modalBuySuccessMessage = modalBuyPaymentWrapper.querySelector('.modal__validation-message--success');
const modalBuySubmitButton = modalBuyPaymentWrapper.querySelector('.modal__submit');


const modalSellElement = document.querySelector('.modal--sell');
const modalSellForm = modalSellElement.querySelector('.modal-sell');
const modalSellPaymentWrapper = modalSellForm.querySelector('.modal__container--payment');
const modalSellErrorMessage = modalSellPaymentWrapper.querySelector('.modal__validation-message--error');
const modalSellSuccessMessage = modalSellPaymentWrapper.querySelector('.modal__validation-message--success');
const modalSellSubmitButton = modalBuyPaymentWrapper.querySelector('.modal__submit');


modalBuyErrorMessage.remove();
modalSellErrorMessage.remove();
modalBuySuccessMessage.remove();
modalSellSuccessMessage.remove();

const showErrorMessage = (wrapper, modalErrorMessage) => {
  if (!wrapper.querySelector('.modal__validation-message--error')) {
    wrapper.appendChild(modalErrorMessage);
  }
};

const showSuccessMessage = (wrapper, modalSuccessMessage) => {
  if (!wrapper.querySelector('.modal__validation-message--success')) {
    wrapper.appendChild(modalSuccessMessage);
  }
};

const deleteErrorMessage = (wrapper, modalErrorMessage) => {
  if (wrapper.querySelector('.modal__validation-message--error')) {
    modalErrorMessage.remove();
  }
};

const deleteSuccessMessage = (wrapper, modalSuccessMessage) => {
  if (wrapper.querySelector('.modal__validation-message--success')) {
    modalSuccessMessage.remove();
  }
};

const toggleSubmitBtn = (state, submitButton) => {
  if (state === 'blocked') {
    submitButton.disabled = true;
    submitButton.textContent = SubmitButtonText.SENDING;
  } else {
    submitButton.disabled = false;
    submitButton.textContent = SubmitButtonText.IDLE;
  }
};

const onSubmitModalForm = () => {
  modalBuyForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristineBuyForm.validate();

    if (isValid) {
      toggleSubmitBtn('blocked', modalBuySubmitButton);
      postModalBuyForm(new FormData(evt.target));
    }
  });

  modalSellForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristineSellForm.validate();

    if (isValid) {
      toggleSubmitBtn('blocked', modalSellSubmitButton);
      postModalSellForm(new FormData(evt.target));
    }
  });
};

async function postModalBuyForm (formData) {
  try {
    await sendData(formData);
    showSuccessMessage(modalBuyPaymentWrapper, modalBuySuccessMessage);
    deleteErrorMessage(modalBuyPaymentWrapper, modalBuyErrorMessage);
  } catch (err) {
    showErrorMessage(modalBuyPaymentWrapper, modalBuyErrorMessage);
    deleteSuccessMessage(modalBuyPaymentWrapper, modalBuySuccessMessage);
  } finally {
    toggleSubmitBtn('unblocked', modalBuySubmitButton);
  }
}

async function postModalSellForm (formData) {
  try {
    await sendData(formData);
    showSuccessMessage(modalSellPaymentWrapper, modalSellSuccessMessage);
    deleteErrorMessage(modalSellPaymentWrapper, modalSellErrorMessage);
  } catch (err) {
    showErrorMessage(modalSellPaymentWrapper, modalSellErrorMessage);
    deleteSuccessMessage(modalSellPaymentWrapper, modalSellSuccessMessage);
  } finally {
    toggleSubmitBtn('unblocked', modalSellSubmitButton);
  }
}

export {onSubmitModalForm};
