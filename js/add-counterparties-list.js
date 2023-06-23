const counterpartiesList = document.querySelector('.users-list__table-body');
const newCounterpartiesTemplate = document.querySelector('#user-table-row__template')
  .content
  .querySelector('.users-list__table-row');

const newBaloonTemplate = document.querySelector('#map-baloon__template')
  .content
  .querySelector('.user-card');

const counterpartyTemplateElementClasses = [
  {
    tableItem: {
      name: '.users-list__table-name span',
      verifiedIcon: '.users-list__table-icon',
      currency: '.users-list__table-currency',
      exchangeRate: '.users-list__table-exchangerate',
      cashlimit: '.users-list__table-cashlimit',
      badgesList: '.users-list__badges-list',
      badgesItem: '.users-list__badges-item',
    }
  }, {
    mapBaloon: {
      name: '.user-card__user-name span',
      verifiedIcon: '.user-card__user-icon',
      currency: '.user-card__cash-currency',
      exchangeRate: '.user-card__cash-exchangerate',
      cashlimit: '.user-card__cash-cashlimit',
      badgesList: '.user-card__badges-list',
      badgesItem: '.user-card__badges-item',
    }
  }
];

const findClassesUsed = (template) => {
  const findedClassesList = counterpartyTemplateElementClasses.find((counterpartyTemplateElementClass) => Object.hasOwn(counterpartyTemplateElementClass, [template]));
  const usededClassesList = findedClassesList[template];
  return usededClassesList;
};

const toComfortableView = (value) => {
  const valueBeforeDot = +(`${ value}`).split('.')[0];
  const valueAfterDot = (`${ value}`).split('.')[1];
  return valueAfterDot ? `${valueBeforeDot.toLocaleString() }.${ valueAfterDot.slice(0, 2)}` : valueBeforeDot.toLocaleString();
};

const createCounterpartyElement = (counterpartyElement, counterparty, classes) => {
  const name = counterparty.userName;
  const nameClass = classes.name;
  const nameElement = counterpartyElement.querySelector(nameClass);
  nameElement.textContent = name;

  const verifiedCounterparty = counterparty.isVerified;
  const verifiedIconClass = classes.verifiedIcon;
  const verifiedIconElement = counterpartyElement.querySelector(verifiedIconClass);
  if (!verifiedCounterparty) {
    verifiedIconElement.remove();
  }

  const balanceCurrency = counterparty.balance.currency;
  const balanceCurrencyClass = classes.currency;
  const balanceCurrencyElement = counterpartyElement.querySelector(balanceCurrencyClass);
  balanceCurrencyElement.textContent = balanceCurrency;

  const exchangeRate = counterparty.exchangeRate;
  const exchangeRateClass = classes.exchangeRate;
  const exchangeRateElement = counterpartyElement.querySelector(exchangeRateClass);
  exchangeRateElement.textContent = `${ toComfortableView(exchangeRate) } ₽`;


  const minAmount = counterparty.minAmount;
  const cashlimitClass = classes.cashlimit;
  const cashlimitElement = counterpartyElement.querySelector(cashlimitClass);

  const paymentMethodsList = counterparty.paymentMethods;
  const paymentMethodsItemClass = classes.badgesItem;
  const paymentMethodsListClass = classes.badgesList;
  const paymentMethodsListElement = counterpartyElement.querySelector(paymentMethodsListClass);
  if (counterparty.status === 'seller') {
    const sellerBalanceAmountRub = counterparty.balance.amount * counterparty.exchangeRate;
    cashlimitElement.textContent = `${ toComfortableView(minAmount) } ₽ - ${ toComfortableView(sellerBalanceAmountRub)} ₽`;

    paymentMethodsListElement.innerHTML = '';
    paymentMethodsList.forEach((paymentMethodItem) => {
      const newPaymentMethodItem = document.createElement('li');
      newPaymentMethodItem.classList.add([paymentMethodsItemClass.substring(1)], 'badge');
      newPaymentMethodItem.textContent = paymentMethodItem.provider;
      paymentMethodsListElement.appendChild(newPaymentMethodItem);
    });
  }

  if (counterparty.status === 'buyer') {
    const buyerBalanceAmountRub = counterparty.balance.amount;
    cashlimitElement.textContent = `${ toComfortableView(minAmount) } ₽ - ${ toComfortableView(buyerBalanceAmountRub) } ₽`;

    paymentMethodsListElement.remove();
  }

  counterpartyElement.dataset.counterpartyId = counterparty.id;
};

const addCounterpartiesList = (counterpartiesData) => {
  const simularListFragment = document.createDocumentFragment();

  counterpartiesData.forEach((counterpartyData) => {
    const counterpartyTableItemElement = newCounterpartiesTemplate.cloneNode(true);
    const tableItemClassList = findClassesUsed('tableItem');
    createCounterpartyElement(counterpartyTableItemElement, counterpartyData, tableItemClassList);

    simularListFragment.appendChild(counterpartyTableItemElement);
  });

  counterpartiesList.appendChild(simularListFragment);
};

const addMapPointBaloon = (counterpartyData) => {
  const counterpartyMapBaloonElement = newBaloonTemplate.cloneNode(true);
  const mapBaloonClassList = findClassesUsed('mapBaloon');
  createCounterpartyElement(counterpartyMapBaloonElement, counterpartyData, mapBaloonClassList);

  return counterpartyMapBaloonElement;
};


export {
  addCounterpartiesList,
  addMapPointBaloon,
  toComfortableView
};
