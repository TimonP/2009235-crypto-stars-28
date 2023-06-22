import {getUserData, getContractorsData} from './api.js';
import {showUserParameters} from './show-user-parameters.js';
import {showServerIsNotAvailableMessage, deleteServerIsNotAvailableMessage} from './server-is-not-available-message.js';
import {beginListenListTypeButtons} from './toogle-list-map.js';
import {initMap} from './add-map.js';
import {saveСounterpartiesData} from './modal-close-open.js';
import {saveUserData} from './modal-autocomplete.js';
import {saveСounterpartiesDataSort, beginListenFilterButtons, startSort} from './counterparties-sort.js';

const fetchData = async () => {
  try {
    const responseUserData = await getUserData();
    console.log(responseUserData);
    showUserParameters(responseUserData);
    saveUserData(responseUserData);

    const responseContractorsData = await getContractorsData();
    console.log(responseContractorsData);
    deleteServerIsNotAvailableMessage();
    initMap();
    saveСounterpartiesData(responseContractorsData);
    saveСounterpartiesDataSort(responseContractorsData); //.slice(20, 22)
    startSort();
    beginListenFilterButtons();
    beginListenListTypeButtons();
  } catch (err) {
    showServerIsNotAvailableMessage();
  }
};

export {fetchData};
