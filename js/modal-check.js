import {findBalance, Currency} from './show-user-parameters.js';
import {convertKeksToRub, convertRubToKeks} from './modal-autocomplete.js';

const modalBuyElement = document.querySelector('.modal--buy');
const modalBuyForm = modalBuyElement.querySelector('.modal-buy');
const modalBuyErrorExample = modalBuyForm.querySelector('.custom-input__error');
const modalBuyProvider = modalBuyForm.querySelector('.payment-methods-provider');
const modalBuyProviderDefault = modalBuyForm.querySelector('.payment-methods-provider-default');
const buySendingAmountInput = modalBuyElement.querySelector('.sending-amount');
const buyReceivingAmountInput = modalBuyElement.querySelector('.receiving-amount');

const modalSellElement = document.querySelector('.modal--sell');
const modalSellForm = modalSellElement.querySelector('.modal-sell');
const modalSellErrorExample = modalSellForm.querySelector('.custom-input__error');
const modalSellProvider = modalSellForm.querySelector('.payment-methods-provider');
const modalSellProviderDefault = modalSellProvider.querySelector('.payment-methods-provider-default');
const sellSendingAmountInput = modalSellElement.querySelector('.sending-amount');
const sellReceivingAmountInput = modalSellElement.querySelector('.receiving-amount');

const toComfortableViewExactValue = (value) => {
  const valueBeforeDot = +(`${ value}`).split('.')[0];
  const valueAfterDot = (`${ value}`).split('.')[1];
  return valueAfterDot ? `${valueBeforeDot.toLocaleString() }.${ valueAfterDot}` : valueBeforeDot.toLocaleString();
};

modalBuyErrorExample.remove();
modalSellErrorExample.remove();

const setRequiredMessage = (modalElement) => {
  const inputsRequired = modalElement.querySelectorAll('[required]');
  inputsRequired.forEach((inputRequired) => {
    inputRequired.dataset.pristineRequiredMessage = 'Обязательное для заполнения поле.';
  });
};
setRequiredMessage(modalBuyElement);
setRequiredMessage(modalSellElement);


let savedCounterpartyData;
const saveCounterpartyDataForCheck = (data) => {
  savedCounterpartyData = data;
};

let savedUserData;
const saveUserDataForCheck = (data) => {
  savedUserData = data;
};

/*ПОКУПКА*/
const pristineBuyForm = new Pristine(modalBuyForm, {
  classTo: 'custom-input__error-wrapper',
  errorTextParent: 'custom-input__error-wrapper',
  errorTextClass: 'custom-input__error',
});

/*ПРОДАЖА*/
const pristineSellForm = new Pristine(modalSellForm, {
  classTo: 'custom-input__error-wrapper',
  errorTextParent: 'custom-input__error-wrapper',
  errorTextClass: 'custom-input__error',
});

/*-----*/
let providerErrorMessage = '';

const validateProvider = (value) => {
  if (value === modalBuyProviderDefault.textContent || value === modalSellProviderDefault.textContent){
    providerErrorMessage = 'Необходимо выбрать платежную систему.';
    return false;
  }

  if (value === 'Cash in person'){
    providerErrorMessage = 'При выбранном способе невозможно проведение онлайн-транзакции.<br> Выберите другую платежную систему.<br> ("Cash in person" - "Наличными лично")';
    return false;
  }

  return true;
};

const validateProviderMessage = () => providerErrorMessage;

pristineBuyForm.addValidator(
  modalBuyProvider,
  validateProvider,
  validateProviderMessage,
);

pristineSellForm.addValidator(
  modalSellProvider,
  validateProvider,
  validateProviderMessage,
);


/*-----*/
let buySendingAmountMessage = '';

const validateBuySendingAmount = (value) => {
  const foundUserRubBalance = findBalance(savedUserData, Currency.RUSSIA);

  if (value < 0) {
    buySendingAmountMessage = 'Значение не может быть отрицательным.';
    return false;
  }

  if (parseInt(value, 10) === 0) {
    buySendingAmountMessage = '0 - недопустимое значение';
    return false;
  }

  if (value > foundUserRubBalance) {
    buySendingAmountMessage = `На вашем счете недостаточно средств.<br> Доступно: ${ toComfortableViewExactValue(foundUserRubBalance) } ₽`;
    return false;
  }

  if (value < savedCounterpartyData.minAmount) {
    buySendingAmountMessage = `Указано занчение меньше минимального размера сделки:<br> ${ toComfortableViewExactValue(savedCounterpartyData.minAmount) } ₽.`;
    return false;
  }

  const maxRubCounterpartyBalanceAmount = convertKeksToRub(savedCounterpartyData.balance.amount);
  if (value > maxRubCounterpartyBalanceAmount) {
    buySendingAmountMessage = `Указано занчение больше максимального размера сделки:<br> ${ toComfortableViewExactValue(maxRubCounterpartyBalanceAmount) } ₽.`;
    return false;
  }

  return true;
};

const validateBuySendingAmountMessage = () => buySendingAmountMessage;

pristineBuyForm.addValidator(
  buySendingAmountInput,
  validateBuySendingAmount,
  validateBuySendingAmountMessage,
);

/*-----*/

let buyReceivingAmountMessage = '';

const validateBuyReceivingAmount = (value) => {
  if (value < 0) {
    buyReceivingAmountMessage = 'Значение не может быть отрицательным.';
    return false;
  }

  if (parseInt(value, 10) === 0) {
    buyReceivingAmountMessage = '0 - недопустимое значение';
    return false;
  }

  const maxKeksCounterpartyBalanceAmount = savedCounterpartyData.balance.amount;
  if (value > maxKeksCounterpartyBalanceAmount) {
    buyReceivingAmountMessage = `Указано занчение больше максимального размера сделки:<br> ${ toComfortableViewExactValue(maxKeksCounterpartyBalanceAmount) } KEKS.`;
    return false;
  }

  const minKeksCounterpartyBalanceAmount = convertRubToKeks(savedCounterpartyData.minAmount);
  if (value < minKeksCounterpartyBalanceAmount) {
    buyReceivingAmountMessage = `Указано занчение меньше максимального размера сделки:<br> ${ toComfortableViewExactValue(minKeksCounterpartyBalanceAmount) } KEKS.`;
    return false;
  }

  return true;
};

const validateBuyReceivingAmountMessage = () => buyReceivingAmountMessage;

pristineBuyForm.addValidator(
  buyReceivingAmountInput,
  validateBuyReceivingAmount,
  validateBuyReceivingAmountMessage,
);

/*-----*/
let sellSendingAmountMessage = '';

const validateSellSendingAmount = (value) => {
  const foundUserKeksBalance = findBalance(savedUserData, Currency.HTML_ACADEMY);

  if (value < 0) {
    sellSendingAmountMessage = 'Значение не может быть отрицательным.';
    return false;
  }

  if (parseInt(value, 10) === 0) {
    sellSendingAmountMessage = '0 - недопустимое значение';
    return false;
  }

  if (value > foundUserKeksBalance) {
    sellSendingAmountMessage = `На вашем счете недостаточно средств.<br> Доступно: ${ toComfortableViewExactValue(foundUserKeksBalance) } KEKS`;
    return false;
  }

  const minKeksCounterpartyAmount = convertRubToKeks(savedCounterpartyData.minAmount);
  if (value < minKeksCounterpartyAmount) {
    sellSendingAmountMessage = `Указано занчение меньше минимального размера сделки:<br> ${ toComfortableViewExactValue(minKeksCounterpartyAmount) } KEKS.`;
    return false;
  }

  const maxKeksCounterpartyBalanceAmount = convertRubToKeks(savedCounterpartyData.balance.amount);
  if (value > maxKeksCounterpartyBalanceAmount) {
    sellSendingAmountMessage = `Указано занчение больше максимального размера сделки:<br> ${ toComfortableViewExactValue(maxKeksCounterpartyBalanceAmount) } KEKS.`;
    return false;
  }

  return true;
};

const validateSellSendingAmountMessage = () => sellSendingAmountMessage;

pristineSellForm.addValidator(
  sellSendingAmountInput,
  validateSellSendingAmount,
  validateSellSendingAmountMessage,
);

/*-----*/

let sellReceivingAmountMessage = '';

const validateSellReceivingAmount = (value) => {
  if (value < 0) {
    sellReceivingAmountMessage = 'Значение не может быть отрицательным.';
    return false;
  }

  if (parseInt(value, 10) === 0) {
    sellReceivingAmountMessage = '0 - недопустимое значение';
    return false;
  }

  const minRudCounterpartyAmount = savedCounterpartyData.minAmount;
  if (value < minRudCounterpartyAmount) {
    sellReceivingAmountMessage = `Указано занчение меньше минимального размера сделки:<br> ${ toComfortableViewExactValue(minRudCounterpartyAmount) } ₽.`;
    return false;
  }

  const maxRubCounterpartyBalanceAmount = savedCounterpartyData.balance.amount;
  if (value > maxRubCounterpartyBalanceAmount) {
    sellReceivingAmountMessage = `Указано занчение больше максимального размера сделки:<br> ${ toComfortableViewExactValue(maxRubCounterpartyBalanceAmount) } ₽.`;
    return false;
  }

  return true;
};

const validateSellReceivingAmountMessage = () => sellReceivingAmountMessage;

pristineBuyForm.addValidator(
  sellReceivingAmountInput,
  validateSellReceivingAmount,
  validateSellReceivingAmountMessage,
);

export {saveCounterpartyDataForCheck, saveUserDataForCheck, pristineBuyForm, pristineSellForm};
