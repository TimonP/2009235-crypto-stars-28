import {getUserData, getContractorsData} from './api.js';
import {showUserParameters} from './show-user-parameters.js';
import {showServerIsNotAvailableMessage, deleteServerIsNotAvailableMessage} from './server-is-not-available-message.js';
import {beginListenListTypeButtons} from './toogle-list-map.js';
import {addCounterpartiesList} from './add-counterparties-list.js';
import {createPoints, initMap} from './add-map.js';
import {saveСounterpartiesData ,findModalOpenElements} from './modal-close-open.js';
import {saveUserData} from './modal-check-and-autocomplete.js';

const fetchData = async () => {
  try {
    const responseUserData = await getUserData();
    console.log(responseUserData);
    showUserParameters(responseUserData);
    saveUserData(responseUserData);

    const responseContractorsData = await getContractorsData();
    console.log(responseContractorsData);
    deleteServerIsNotAvailableMessage();
    addCounterpartiesList(responseContractorsData);
    initMap();
    createPoints(responseContractorsData);
    beginListenListTypeButtons();
    saveСounterpartiesData(responseContractorsData);
    findModalOpenElements();
  } catch (err) {
    showServerIsNotAvailableMessage();
  }
};

export {fetchData};
