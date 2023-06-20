import {toComfortableView} from './add-counterparties-list.js';
import {findBalance, Currency} from './show-user-parameters.js';

const modalBuyElement = document.querySelector('.modal--buy');
const counterpartyPaymentMethodsList = modalBuyElement.querySelector('#counterparty-paymentMethods-provider');
const counterpartyAccountNumberInput = modalBuyElement.querySelector('#counterparty-paymentMethods-accountNumber');

const modalSellElement = document.querySelector('.modal--sell');
const userPaymentMethodsList = modalSellElement.querySelector('#user-paymentMethods-provider');
const userAccountNumberInput = modalSellElement.querySelector('#user-paymentMethods-accountNumber');

const verifiedUserIcon = modalBuyElement.querySelector('.transaction-info__data--icon');


let savedCounterpartyData;
let savedUserData = [];

const saveUserData = (data) => {
  savedUserData = data;
};


const addPaymentMethodsList = (paymentMethodsListElement, savedAccountData) => {
  const paymentMethodOptionDefault = paymentMethodsListElement.querySelector('option[selected][disabled]');
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
  const counterpartyExchangeRate = modalElement.querySelector('.transaction-info__item--exchangerate .transaction-info__data');
  counterpartyExchangeRate.textContent = `${ toComfortableView(savedCounterpartyData.exchangeRate) } ₽`;


  /*----заполнение скрытых полей----*/
  /*ID контрагента*/
  const counterpartyIdInput = modalElement.querySelector('input[name="contractorId"]');
  counterpartyIdInput.value = savedCounterpartyData.id;

  /*курс контрагента*/
  const counterpartyExchangeRateInput = modalElement.querySelector('input[name="exchangeRate"]');
  counterpartyExchangeRateInput.value = savedCounterpartyData.exchangeRate;

  /*----общие константы для покупки/продажи----*/
  const counterpartyCashlimit = modalElement.querySelector('.transaction-info__item--cashlimit .transaction-info__data');

  /* общие константы для скрытых полей */
  const counterpartySendingCurrencyInput = modalElement.querySelector('input[name="sendingCurrency"]');
  const counterpartyReceivingCurrencyInput = modalElement.querySelector('input[name="receivingCurrency"]');

  /* ПОКУПКА */
  if (savedCounterpartyData.status === 'seller') {
    /*отображение лимита контрагента*/
    counterpartyCashlimit.textContent = `${ toComfortableView(savedCounterpartyData.minAmount) } ₽ - ${ toComfortableView(savedCounterpartyData.balance.amount * savedCounterpartyData.exchangeRate)} ₽`;

    /*отображение платежных систем контрагента*/
    addPaymentMethodsList(counterpartyPaymentMethodsList, savedCounterpartyData);

    /*отображение криптокошелька пользователя*/
    const userWalletAddressInput = modalElement.querySelector('#user-wallet-address');
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
    const counterpartyWalletAddressInput = modalElement.querySelector('#counterparty-wallet-address');
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
const buySendingAmountInput = modalBuyElement.querySelector('#buy-sending-amount');
const buyReceivingAmountInput = modalBuyElement.querySelector('#buy-receiving-amount');

const onBuySendingAmountChange = (evt) => {
  buyReceivingAmountInput.value = convertRubToKeks(evt.target.value);
};
buySendingAmountInput.addEventListener('input', onBuySendingAmountChange);

const onBuyReceivingAmountChange = (evt) => {
  buySendingAmountInput.value = convertKeksToRub(evt.target.value);
};
buyReceivingAmountInput.addEventListener('input', onBuyReceivingAmountChange);

/*ПРОДАЖА*/
const sellSendingAmountInput = modalSellElement.querySelector('#sell-sending-amount');
const sellReceivingAmountInput = modalSellElement.querySelector('#sell-receiving-amount');

const onSellSendingAmountChange = (evt) => {
  sellReceivingAmountInput.value = convertKeksToRub(evt.target.value);
};
sellSendingAmountInput.addEventListener('input', onSellSendingAmountChange);

const onSellReceivingAmountChange = (evt) => {
  sellSendingAmountInput.value = convertRubToKeks(evt.target.value);
};
sellReceivingAmountInput.addEventListener('input', onSellReceivingAmountChange);

/*Обменять все*/
/*Обменять все*/
const buySendingAmountAllButton = modalBuyElement.querySelector('#buy-sending-amount-all');
const sellSendingAmountAllButton = modalSellElement.querySelector('#sell-sending-amount-all');
const sellReceivingAmountAllButton = modalSellElement.querySelector('#sell-receiving-amount-all');

buySendingAmountAllButton.addEventListener('click', () => {
  const foundUserRubBalance = findBalance(savedUserData, Currency.RUSSIA);
  buySendingAmountInput.value = foundUserRubBalance;
  buyReceivingAmountInput.value = convertRubToKeks(foundUserRubBalance);
});

sellSendingAmountAllButton.addEventListener('click', () => {
  const foundUserKeksBalance = findBalance(savedUserData, Currency.HTML_ACADEMY);
  sellSendingAmountInput.value = foundUserKeksBalance;
  sellReceivingAmountInput.value = convertKeksToRub(foundUserKeksBalance);
});

sellReceivingAmountAllButton.addEventListener('click', () => {
  const foundCounterpartyRubBalance = savedCounterpartyData.balance.amount;
  sellReceivingAmountInput.value = foundCounterpartyRubBalance;
  sellSendingAmountInput.value = convertRubToKeks(foundCounterpartyRubBalance);
});

export {saveUserData, autocompleteModalForm};
