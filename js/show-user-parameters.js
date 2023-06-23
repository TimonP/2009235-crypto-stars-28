const userProfile = document.querySelector('.user-profile');
const userCryptoBalance = userProfile.querySelector('.user-profile__cash-balance--keks');
const userFiatBalance = userProfile.querySelector('.user-profile__cash-balance--rub');
const userName = userProfile.querySelector('.user-profile__name span');

const Currency = {
  RUSSIA: 'RUB',
  HTML_ACADEMY: 'KEKS',
};

const findBalance = (receivedData, currency) => receivedData.balances.find((balance) => balance.currency.includes(currency)).amount;

const showUserParameters = (receivedData) => {
  if (receivedData) {
    userCryptoBalance.textContent = findBalance(receivedData, Currency.HTML_ACADEMY);
    userFiatBalance.textContent = findBalance(receivedData, Currency.RUSSIA);
    userName.textContent = receivedData.userName;
  } else {
    userProfile.innerHTML = '';
  }
};

export {
  showUserParameters,
  findBalance,
  Currency
};
