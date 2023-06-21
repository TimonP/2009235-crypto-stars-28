import {toComfortableView} from './add-counterparties-list.js';
import {findBalance, Currency} from './show-user-parameters.js';
import {saveCounterpartyDataForCheck, saveUserDataForCheck, pristineBuyForm, pristineSellForm} from './modal-check.js';

const modalBuyElement = document.querySelector('.modal--buy');
const counterpartyPaymentMethodsList = modalBuyElement.querySelector('.payment-methods-provider');
const counterpartyAccountNumberInput = modalBuyElement.querySelector('.payment-account-number');
const buySendingAmountInput = modalBuyElement.querySelector('.sending-amount');
const buyReceivingAmountInput = modalBuyElement.querySelector('.receiving-amount');

const modalSellElement = document.querySelector('.modal--sell');
const userPaymentMethodsList = modalSellElement.querySelector('.payment-methods-provider');
const userAccountNumberInput = modalSellElement.querySelector('.payment-account-number');
const sellSendingAmountInput = modalSellElement.querySelector('.sending-amount');
const sellReceivingAmountInput = modalSellElement.querySelector('.receiving-amount');

const buySendingAmountAllButton = modalBuyElement.querySelector('.sending-amount-all');
const sellSendingAmountAllButton = modalSellElement.querySelector('.sending-amount-all');
const sellReceivingAmountAllButton = modalSellElement.querySelector('.receiving-amount-all');

const verifiedUserIcon = modalBuyElement.querySelector('.transaction-info__data--icon');


let savedCounterpartyData;
let savedUserData = [];

const saveUserData = (data) => {
  savedUserData = data;
};


const addPaymentMethodsList = (paymentMethodsListElement, savedAccountData) => {
  const paymentMethodOptionDefault = paymentMethodsListElement.querySelector('.payment-methods-provider-default');
  paymentMethodsListElement.innerHTML = '';
  paymentMethodsListElement.appendChild(paymentMethodOptionDefault);
  savedAccountData.paymentMethods.forEach((paymentMethod) => {
    const newPaymentMethod = document.createElement('option');
    newPaymentMethod.textContent = paymentMethod.provider;
    paymentMethodsListElement.appendChild(newPaymentMethod);
  });
};

const autocompleteCounterpartyData = (modalElement) => {
  /*отображение имени и иконки*/
  const counterpartyName = modalElement.querySelector('.transaction-info__data--name');
  counterpartyName.textContent = savedCounterpartyData.userName;
  if (savedCounterpartyData.isVerified) {
    counterpartyName.insertAdjacentHTML('afterBegin', verifiedUserIcon.outerHTML);
  }

  /*отображение курса*/
  const counterpartyExchangeRate = modalElement.querySelector('.transaction-info__data--exchangerate');
  counterpartyExchangeRate.textContent = `${ toComfortableView(savedCounterpartyData.exchangeRate) } ₽`;

  /*очищение пароля*/
  const passwordInput = modalElement.querySelector('.payment-password');
  passwordInput.value = '';

  /*удаление пароля class="payment-password"*/
  /*ID контрагента*/
  const counterpartyIdInput = modalElement.querySelector('.contractor-id');
  counterpartyIdInput.value = savedCounterpartyData.id;

  /*курс контрагента*/
  const counterpartyExchangeRateInput = modalElement.querySelector('.exchange-rate');
  counterpartyExchangeRateInput.value = savedCounterpartyData.exchangeRate;

  /*----общие константы для покупки/продажи----*/
  const counterpartyCashlimit = modalElement.querySelector('.transaction-info__data--cashlimit');

  /* общие константы для скрытых полей */
  const counterpartySendingCurrencyInput = modalElement.querySelector('.sending-currency');
  const counterpartyReceivingCurrencyInput = modalElement.querySelector('.receiving-currency');

  /* ПОКУПКА */
  if (savedCounterpartyData.status === 'seller') {
    /*отображение лимита контрагента*/
    counterpartyCashlimit.textContent = `${ toComfortableView(savedCounterpartyData.minAmount) } ₽ - ${ toComfortableView(savedCounterpartyData.balance.amount * savedCounterpartyData.exchangeRate)} ₽`;

    /*отображение платежных систем контрагента*/
    addPaymentMethodsList(counterpartyPaymentMethodsList, savedCounterpartyData);

    /*отображение криптокошелька пользователя*/
    const userWalletAddressInput = modalElement.querySelector('.wallet-address');
    userWalletAddressInput.value = savedUserData.wallet.address;

    /*Обмен RUB на KEKS (заполнение скрытых полей)*/
    counterpartySendingCurrencyInput.value = 'RUB';
    counterpartyReceivingCurrencyInput.value = 'KEKS';
  }

  /* ПРОДАЖА */
  if (savedCounterpartyData.status === 'buyer') {
    /*отображение лимита контрагента*/
    counterpartyCashlimit.textContent = `${ toComfortableView(savedCounterpartyData.minAmount) } ₽ - ${ toComfortableView(savedCounterpartyData.balance.amount) } ₽`;

    /*отображение платежных систем пользователя*/
    addPaymentMethodsList(userPaymentMethodsList, savedUserData);

    /*отображение криптокошелька контрагента*/
    const counterpartyWalletAddressInput = modalElement.querySelector('.wallet-address');
    counterpartyWalletAddressInput.value = savedCounterpartyData.wallet.address;

    /*Обмен KEKS на RUB (заполнение скрытых полей)*/
    counterpartySendingCurrencyInput.value = 'KEKS';
    counterpartyReceivingCurrencyInput.value = 'RUB';
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
  console.log(savedCounterpartyData);
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
counterpartyPaymentMethodsList.addEventListener('change', onChangeCounterpartyProvider);

const onChangeUserProvider = (evt) => {
  const selectedProvider = evt.target.value;
  changeAccountNumber(userAccountNumberInput, savedUserData, selectedProvider);
};
userPaymentMethodsList.addEventListener('change', onChangeUserProvider);

/*Зависимые поля*/
const convertKeksToRub = (value) => {
  const resultingValue = value * savedCounterpartyData.exchangeRate;
  return resultingValue;
};

const convertRubToKeks = (value) => {
  const resultingValue = value / savedCounterpartyData.exchangeRate;
  return resultingValue;
};

/*ПОКУПКА*/
const onBuySendingAmountChange = (evt) => {
  buyReceivingAmountInput.value = +convertRubToKeks(evt.target.value);
  pristineBuyForm.validate(buyReceivingAmountInput);
};
buySendingAmountInput.addEventListener('input', onBuySendingAmountChange);

const onBuyReceivingAmountChange = (evt) => {
  buySendingAmountInput.value = +convertKeksToRub(evt.target.value);
  pristineBuyForm.validate(buySendingAmountInput);
};
buyReceivingAmountInput.addEventListener('input', onBuyReceivingAmountChange);

/*ПРОДАЖА*/
const onSellSendingAmountChange = (evt) => {
  sellReceivingAmountInput.value = convertKeksToRub(evt.target.value);
  pristineSellForm.validate(sellReceivingAmountInput);
};
sellSendingAmountInput.addEventListener('input', onSellSendingAmountChange);

const onSellReceivingAmountChange = (evt) => {
  sellSendingAmountInput.value = convertRubToKeks(evt.target.value);
  pristineSellForm.validate(sellSendingAmountInput);
};
sellReceivingAmountInput.addEventListener('input', onSellReceivingAmountChange);

/*Обменять все*/
buySendingAmountAllButton.addEventListener('click', () => {
  const foundUserRubBalance = findBalance(savedUserData, Currency.RUSSIA);
  buySendingAmountInput.value = foundUserRubBalance;
  buyReceivingAmountInput.value = convertRubToKeks(foundUserRubBalance);
  pristineBuyForm.validate(buySendingAmountInput);
  pristineBuyForm.validate(buyReceivingAmountInput);
});

sellSendingAmountAllButton.addEventListener('click', () => {
  const foundUserKeksBalance = findBalance(savedUserData, Currency.HTML_ACADEMY);
  sellSendingAmountInput.value = foundUserKeksBalance;
  sellReceivingAmountInput.value = convertKeksToRub(foundUserKeksBalance);
  pristineSellForm.validate(sellSendingAmountInput);
  pristineSellForm.validate(sellReceivingAmountInput);
});

sellReceivingAmountAllButton.addEventListener('click', () => {
  const foundCounterpartyRubBalance = savedCounterpartyData.balance.amount;
  sellReceivingAmountInput.value = foundCounterpartyRubBalance;
  sellSendingAmountInput.value = convertRubToKeks(foundCounterpartyRubBalance);
  pristineSellForm.validate(sellSendingAmountInput);
  pristineSellForm.validate(sellReceivingAmountInput);
});

export {saveUserData, autocompleteModalForm, convertKeksToRub, convertRubToKeks};
