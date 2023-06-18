import {getUserData, getContractorsData} from './api.js';
import {showAlert} from './utils.js';
import {showUserParameters} from './show-user-parameters.js';
import {showServerIsNotAvailableMessage, deleteServerIsNotAvailableMessage} from './server-is-not-available-message.js';
import {beginListenListTypeButtons} from './toogle-list-map.js';
import {addCounterpartiesList, addMapPointBaloon} from './add-counterparties-list.js';

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
    deleteServerIsNotAvailableMessage();
    addCounterpartiesList(responseContractorsData);
    addMapPointBaloon(responseContractorsData[2]);
    beginListenListTypeButtons();
  } catch (err) {
    showServerIsNotAvailableMessage();
    //showAlert(err.message);
  }
};

export {fetchUserData, fetchContractorsData};
