import {getUserData, getContractorsData} from './api.js';
import {showAlert} from './utils.js';
import {showUserParameters} from './show-user-parameters.js';

const fetchUserData = async () => {
  try {
    const responseUserData = await getUserData();
    console.log(responseUserData);
    showUserParameters(responseUserData);
  } catch (err) {
    showAlert(err.message);
  }
};

const fetchContractorsData = async () => {
  try {
    const responseContractorsData = await getContractorsData();
    console.log(responseContractorsData);
  } catch (err) {
    showAlert(err.message);
  }
};

export {fetchUserData, fetchContractorsData};
