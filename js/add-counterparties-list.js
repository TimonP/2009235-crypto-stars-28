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
      verifiedImg: '.users-list__table-name svg',
      currency: '.users-list__table-currency',
      exchangeRate: '.users-list__table-exchangerate',
      cashlimit: '.users-list__table-cashlimit',
      badgesList: '.users-list__badges-list',
      badgesItem: '.users-list__badges-item',
    }
  }, {
    mapBaloon: {
      name: '.user-card__user-name span',
      verifiedImg: '.user-card__user-name svg',
      currency: '.user-card__cash-currency',
      exchangeRate: '.user-card__cash-exchangerate',
      cashlimit: '.user-card__cash-cashlimit',
      badgesList: '.user-card__badges-list',
      badgesItem: '.user-card__badges-item',
    }
  }
];

const findClassesUsed = (template) => {
  const classesUsed = counterpartyTemplateElementClasses.find((counterpartyTemplateElementClass) => Object.hasOwn(counterpartyTemplateElementClass, [template]));
  return classesUsed[template];
};

const createCounterpartyElement = (counterpartyElement, counterparty, classes) => {
  counterpartyElement.querySelector([classes.name]).textContent = counterparty.userName;
  if (!counterparty.isVerified) {
    counterpartyElement.querySelector([classes.verifiedImg]).remove();
  }

  counterpartyElement.querySelector([classes.currency]).textContent = counterparty.balance.currency;

  const toComfortableView = (value) => Math.trunc(value).toLocaleString();
  counterpartyElement.querySelector([classes.exchangeRate]).textContent = `${ toComfortableView(counterparty.exchangeRate) } ₽`;

  if (counterparty.status === 'seller') {
    counterpartyElement.querySelector([classes.cashlimit]).textContent = `${ toComfortableView(counterparty.minAmount) } ₽ - ${ toComfortableView(counterparty.balance.amount * counterparty.exchangeRate)} ₽`;
    const paymentMethodsList = counterpartyElement.querySelector([classes.badgesList]);
    paymentMethodsList.innerHTML = '';
    counterparty.paymentMethods.forEach((paymentMethod) => {
      const newPaymentMethod = document.createElement('li');
      newPaymentMethod.classList.add([classes.badgesItem.substring(1)], 'badge');
      newPaymentMethod.textContent = paymentMethod.provider;
      paymentMethodsList.appendChild(newPaymentMethod);
    });
  }

  if (counterparty.status === 'buyer') {
    counterpartyElement.querySelector([classes.cashlimit]).textContent = `${ toComfortableView(counterparty.minAmount) } ₽ - ${ toComfortableView(counterparty.balance.amount) } ₽`;
    counterpartyElement.querySelector([classes.badgesList]).remove();
  }

  counterpartyElement.dataset.counterpartyId = counterparty.id;
};

const addCounterpartiesList = (counterpartiesData) => {
  const simularListFragment = document.createDocumentFragment();

  counterpartiesData.forEach((counterparty) => {
    const counterpartyTableItemElement = newCounterpartiesTemplate.cloneNode(true);
    createCounterpartyElement(counterpartyTableItemElement, counterparty, findClassesUsed('tableItem'));

    simularListFragment.appendChild(counterpartyTableItemElement);
  });

  counterpartiesList.appendChild(simularListFragment);
};

const addMapPointBaloon = (counterparty) => {
  const counterpartyMapBaloonElement = newBaloonTemplate.cloneNode(true);
  createCounterpartyElement(counterpartyMapBaloonElement, counterparty, findClassesUsed('mapBaloon'));

  return counterpartyMapBaloonElement;
};


export {addCounterpartiesList, addMapPointBaloon};
