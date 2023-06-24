const BASE_URL = 'https://cryptostar.grading.pages.academy';
const Route = {
  GET_USER_DATA: '/user',
  GET_CONTRACTORS_DATA: '/contractors',
  SEND_DATA: '/',
};
const Method = {
  GET: 'GET',
  POST: 'POST',
};

const ErrorText = {
  SEND_DATA: 'Ошибка заполнения формы',
};

const load = (route, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}${route}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .catch((response) => {
      if (errorText) {
        throw new Error(errorText);
      } else {
        throw new Error(response.message);
      }
    });

const getUserData = () => load(Route.GET_USER_DATA);
const getContractorsData = () => load(Route.GET_CONTRACTORS_DATA);

const sendData = (body) => load(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);

export {
  getUserData,
  getContractorsData,
  sendData
};
