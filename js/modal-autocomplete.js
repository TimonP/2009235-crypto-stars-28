import {
  toComfortableView
} from './add-counterparties-list.js';
import {
  findBalance,
  Currency
} from './show-user-parameters.js';
import {
  saveCounterpartyDataForCheck,
  saveUserDataForCheck,
  pristineBuyForm,
  pristineSellForm
} from './modal-check.js';
import {
  isEscapeKey
} from './utils.js';

const modalBuyElement = document.querySelector('.modal--buy');
const counterpartyPaymentMethodsList = modalBuyElement.querySelector('.payment-methods-provider');
const counterpartyAccountNumberInput = modalBuyElement.querySelector('.payment-account-number');
const buySendingAmountInput = modalBuyElement.querySelector('.sending-amount');
const buyReceivingAmountInput = modalBuyElement.querySelector('.receiving-amount');
const modalBuyInputs = modalBuyElement.querySelectorAll('.modal-buy-input');

const modalSellElement = document.querySelector('.modal--sell');
const userPaymentMethodsList = modalSellElement.querySelector('.payment-methods-provider');
const userAccountNumberInput = modalSellElement.querySelector('.payment-account-number');
const sellSendingAmountInput = modalSellElement.querySelector('.sending-amount');
const sellReceivingAmountInput = modalSellElement.querySelector('.receiving-amount');
const modalSellInputs = modalBuyElement.querySelectorAll('.modal-sell-input');

const buySendingAmountAllButton = modalBuyElement.querySelector('.sending-amount-all');
const sellSendingAmountAllButton = modalSellElement.querySelector('.sending-amount-all');
const sellReceivingAmountAllButton = modalSellElement.querySelector('.receiving-amount-all');

const verifiedUserIcon = modalBuyElement.querySelector('.transaction-info__data--icon');


let savedCounterpartyData;
let savedUserData;

const saveUserData = (data) => {
  savedUserData = data;
};


const convertKeksToRub = (value) => value * savedCounterpartyData.exchangeRate;
const convertRubToKeks = (value) => value / savedCounterpartyData.exchangeRate;

const addPaymentMethodsList = (paymentMethodsListElement, savedAccountData) => {
  const paymentMethodOptionDefault = paymentMethodsListElement.querySelector('.payment-methods-provider-default');
  paymentMethodsListElement.innerHTML = '';
  paymentMethodsListElement.appendChild(paymentMethodOptionDefault);

  const paymentMethods = savedAccountData.paymentMethods;
  paymentMethods.forEach((paymentMethod) => {
    const newPaymentMethod = document.createElement('option');
    newPaymentMethod.textContent = paymentMethod.provider;
    paymentMethodsListElement.appendChild(newPaymentMethod);
  });
};

const autocompleteCounterpartyData = (modalElement) => {
  const counterpartyName = savedCounterpartyData.userName;
  const counterpartyNameElement = modalElement.querySelector('.transaction-info__data--name');
  counterpartyNameElement.textContent = counterpartyName;

  const verifiedCounterparty = savedCounterpartyData.isVerified;
  if (verifiedCounterparty) {
    counterpartyNameElement.insertAdjacentHTML('afterBegin', verifiedUserIcon.outerHTML);
  }

  /*курс контрагента*/
  const counterpartyExchangeRate = savedCounterpartyData.exchangeRate;
  const counterpartyExchangeRateElement = modalElement.querySelector('.transaction-info__data--exchangerate');
  counterpartyExchangeRateElement.textContent = `${ toComfortableView(counterpartyExchangeRate) } ₽`;

  const counterpartyExchangeRateInput = modalElement.querySelector('.exchange-rate');
  counterpartyExchangeRateInput.value = counterpartyExchangeRate;

  /*очищение пароля*/
  const passwordInput = modalElement.querySelector('.payment-password');
  passwordInput.value = '';

  /*ID контрагента*/
  const counterpartyID = savedCounterpartyData.id;
  const counterpartyIDInput = modalElement.querySelector('.contractor-id');
  counterpartyIDInput.value = counterpartyID;


  /*общие константы для покупки/продажи*/
  const counterpartyCashlimit = modalElement.querySelector('.transaction-info__data--cashlimit');
  const sendingCurrencyInput = modalElement.querySelector('.sending-currency');
  const receivingCurrencyInput = modalElement.querySelector('.receiving-currency');

  const counterpartyMinAmount = savedCounterpartyData.minAmount;
  const counterpartyBalanceAmount = savedCounterpartyData.balance.amount;

  /*ПОКУПКА*/
  if (savedCounterpartyData.status === 'seller') {
    /*отображение лимита контрагента*/
    counterpartyCashlimit.textContent = `${ toComfortableView(counterpartyMinAmount) } ₽ - ${ toComfortableView(convertKeksToRub(counterpartyBalanceAmount))} ₽`;

    /*отображение платежных систем контрагента*/
    addPaymentMethodsList(counterpartyPaymentMethodsList, savedCounterpartyData);

    /*отображение криптокошелька пользователя*/
    const userWalletAddress = savedUserData.wallet.address;
    const userWalletAddressInput = modalElement.querySelector('.wallet-address');
    userWalletAddressInput.value = userWalletAddress;

    /*Обмен RUB на KEKS (заполнение скрытых полей)*/
    sendingCurrencyInput.value = Currency.RUSSIA;
    receivingCurrencyInput.value = Currency.HTML_ACADEMY;
  }

  /*ПРОДАЖА*/
  if (savedCounterpartyData.status === 'buyer') {
    /*отображение лимита контрагента*/
    counterpartyCashlimit.textContent = `${ toComfortableView(counterpartyMinAmount) } ₽ - ${ toComfortableView(counterpartyBalanceAmount) } ₽`;

    /*отображение платежных систем пользователя*/
    addPaymentMethodsList(userPaymentMethodsList, savedUserData);

    /*отображение криптокошелька контрагента*/
    const counterpartyWalletAddress = savedCounterpartyData.wallet.address;
    const counterpartyWalletAddressInput = modalElement.querySelector('.wallet-address');
    counterpartyWalletAddressInput.value = counterpartyWalletAddress;

    /*Обмен KEKS на RUB (заполнение скрытых полей)*/
    sendingCurrencyInput.value = Currency.HTML_ACADEMY;
    receivingCurrencyInput.value = Currency.RUSSIA;
  }
};

const autocompleteModalForm = (counterpartyData) => {
  savedCounterpartyData = counterpartyData;
  if (counterpartyData.status === 'seller') {
    autocompleteCounterpartyData(modalBuyElement);
  }
  if (counterpartyData.status === 'buyer') {
    autocompleteCounterpartyData(modalSellElement);
  }
  saveCounterpartyDataForCheck(savedCounterpartyData);
  saveUserDataForCheck(savedUserData);
};

/*Изменение платежной системы*/
const changeAccountNumber = (accountNumberInput, savedAccountData, provider) => {
  accountNumberInput.placeholder = '';
  const findedAccountNumber = savedAccountData.paymentMethods.find((paymentMethod) => paymentMethod.provider === provider);
  if (findedAccountNumber.provider === 'Cash in person') {
    accountNumberInput.value = '';
  } else {
    accountNumberInput.value = findedAccountNumber.accountNumber;
  }
};

const onChangeCounterpartyProvider = (evt) => {
  const selectedProvider = evt.target.value;
  changeAccountNumber(counterpartyAccountNumberInput, savedCounterpartyData, selectedProvider);
};

const onChangeUserProvider = (evt) => {
  const selectedProvider = evt.target.value;
  changeAccountNumber(userAccountNumberInput, savedUserData, selectedProvider);
};

/*Зависимые поля*/
/*ПОКУПКА*/
const onBuySendingAmountChange = (evt) => {
  buyReceivingAmountInput.value = +convertRubToKeks(evt.target.value);
  pristineBuyForm.validate(buyReceivingAmountInput);
};

const onBuyReceivingAmountChange = (evt) => {
  buySendingAmountInput.value = +convertKeksToRub(evt.target.value);
  pristineBuyForm.validate(buySendingAmountInput);
};

/*ПРОДАЖА*/
const onSellSendingAmountChange = (evt) => {
  sellReceivingAmountInput.value = convertKeksToRub(evt.target.value);
  pristineSellForm.validate(sellReceivingAmountInput);
};

const onSellReceivingAmountChange = (evt) => {
  sellSendingAmountInput.value = convertRubToKeks(evt.target.value);
  pristineSellForm.validate(sellSendingAmountInput);
};

/*Обменять все*/
const onBuySendingAmountAllButton = () => {
  const foundUserRubBalance = findBalance(savedUserData, Currency.RUSSIA);
  buySendingAmountInput.value = foundUserRubBalance;
  buyReceivingAmountInput.value = convertRubToKeks(foundUserRubBalance);
  pristineBuyForm.validate(buySendingAmountInput);
  pristineBuyForm.validate(buyReceivingAmountInput);
};

const onSellSendingAmountAllButton = () => {
  const foundUserKeksBalance = findBalance(savedUserData, Currency.HTML_ACADEMY);
  sellSendingAmountInput.value = foundUserKeksBalance;
  sellReceivingAmountInput.value = convertKeksToRub(foundUserKeksBalance);
  pristineSellForm.validate(sellSendingAmountInput);
  pristineSellForm.validate(sellReceivingAmountInput);
};

const onSellReceivingAmountAllButton = () => {
  const foundCounterpartyRubBalance = savedCounterpartyData.balance.amount;
  sellReceivingAmountInput.value = foundCounterpartyRubBalance;
  sellSendingAmountInput.value = convertRubToKeks(foundCounterpartyRubBalance);
  pristineSellForm.validate(sellSendingAmountInput);
  pristineSellForm.validate(sellReceivingAmountInput);
};

/*-----*/
const onInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

/*Прослушивание событий*/

const selectActionForEventListener = (boolean) => boolean ? 'addEventListener' : 'removeEventListener';

const listenModalBuyElements = (boolean) => {
  const action = selectActionForEventListener(boolean);

  counterpartyPaymentMethodsList[action]('change', onChangeCounterpartyProvider);
  buySendingAmountInput[action]('input', onBuySendingAmountChange);
  buyReceivingAmountInput[action]('input', onBuyReceivingAmountChange);
  buySendingAmountAllButton[action]('click', onBuySendingAmountAllButton);
  modalBuyInputs.forEach((modalBuyInput) => modalBuyInput[action]('keydown', onInputKeydown));
};

const listenModalSellElements = (boolean) => {
  const action = selectActionForEventListener(boolean);

  userPaymentMethodsList[action]('change', onChangeUserProvider);
  sellSendingAmountInput[action]('input', onSellSendingAmountChange);
  sellReceivingAmountInput[action]('input', onSellReceivingAmountChange);
  sellSendingAmountAllButton[action]('click', onSellSendingAmountAllButton);
  sellReceivingAmountAllButton[action]('click', onSellReceivingAmountAllButton);
  modalSellInputs.forEach((modalSellInput) => modalSellInput[action]('keydown', onInputKeydown));
};

export {
  saveUserData,
  autocompleteModalForm,
  convertKeksToRub,
  convertRubToKeks,
  listenModalBuyElements,
  listenModalSellElements
};
