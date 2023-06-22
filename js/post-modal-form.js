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
const modalBuyMessage = modalBuyPaymentWrapper.querySelector('.modal__validation-message');
const modalBuySubmitButton = modalBuyPaymentWrapper.querySelector('.modal__submit');


const modalSellElement = document.querySelector('.modal--sell');
const modalSellForm = modalSellElement.querySelector('.modal-sell');
const modalSellPaymentWrapper = modalSellForm.querySelector('.modal__container--payment');
const modalSellErrorMessage = modalSellPaymentWrapper.querySelector('.modal__validation-message--error');
const modalSellSuccessMessage = modalSellPaymentWrapper.querySelector('.modal__validation-message--success');
const modalSellMessage = modalBuyPaymentWrapper.querySelector('.modal__validation-message');
const modalSellSubmitButton = modalBuyPaymentWrapper.querySelector('.modal__submit');

const modalErrorMessageIcon = modalSellPaymentWrapper.querySelector('.modal__validation-message--error-icon');
const modalSuccessMessageIcon = modalSellPaymentWrapper.querySelector('.modal__validation-message--success-icon');


modalBuyErrorMessage.remove();
modalSellErrorMessage.remove();
modalBuySuccessMessage.remove();
modalSellSuccessMessage.remove();


const showHiddenMessage = (modalMessage, wrapper) => {
  modalMessage.textContent = 'Заполните форму';
  modalMessage.style.opacity = '0';
  modalMessage.className = 'modal__validation-message';
  wrapper.appendChild(modalMessage);
};

const showModalBuyHiddenMessage = () => {
  showHiddenMessage(modalBuyMessage, modalBuyPaymentWrapper);
};

const showModalSellHiddenMessage = () => {
  showHiddenMessage(modalSellMessage, modalSellPaymentWrapper);
};


const showErrorMessage = (modalErrorMessage, text = 'Ошибка заполнения формы') => {
  if (modalErrorMessage.classList.contains('modal__validation-message--success')) {
    modalErrorMessage.classList.remove('modal__validation-message--success');
  }
  modalErrorMessage.classList.add('modal__validation-message--error');
  modalErrorMessage.removeAttribute('style');
  modalErrorMessage.textContent = text;
  modalErrorMessage.insertAdjacentHTML('afterBegin', modalErrorMessageIcon.outerHTML);
};

const showSuccessMessage = (modalSuccessMessage, text = 'Данные успешно отправлены') => {
  if (modalSuccessMessage.classList.contains('modal__validation-message--error')) {
    modalSuccessMessage.classList.remove('modal__validation-message--error');
  }
  modalSuccessMessage.classList.add('modal__validation-message--success');
  modalSuccessMessage.removeAttribute('style');
  modalSuccessMessage.textContent = text;
  modalSuccessMessage.insertAdjacentHTML('afterBegin', modalSuccessMessageIcon.outerHTML);
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
    showSuccessMessage(modalBuyMessage);
  } catch (err) {
    showErrorMessage(modalBuyMessage);
  } finally {
    toggleSubmitBtn('unblocked', modalBuySubmitButton);
  }
}

async function postModalSellForm (formData) {
  try {
    await sendData(formData);
    showSuccessMessage(modalSellMessage);
  } catch (err) {
    showErrorMessage(modalSellMessage);
  } finally {
    toggleSubmitBtn('unblocked', modalSellSubmitButton);
  }
}

export {onSubmitModalForm, showModalBuyHiddenMessage, showModalSellHiddenMessage};
