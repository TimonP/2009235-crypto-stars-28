let savedUserData = [];

const saveUserData = (data) => {
  savedUserData = data;
};

const autocompleteModalForm = (counterpartyData) => {
  if (counterpartyData.status === 'seller') {
    console.log(counterpartyData);
  }
  if (counterpartyData.status === 'buyer') {
    console.log(counterpartyData);
  }
};

export {saveUserData, autocompleteModalForm};
