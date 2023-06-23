const main = document.querySelector('.main');
const userProfile = document.querySelector('.container--server-is-not-available');
const containers = main.querySelectorAll('.container');

const showServerIsNotAvailableMessage = () => {
  containers.forEach((container) => {
    container.remove();
  });
  main.appendChild(userProfile);
  userProfile.style.display = null;
};

const deleteServerIsNotAvailableMessage = () => {
  userProfile.remove();
};

export {
  showServerIsNotAvailableMessage,
  deleteServerIsNotAvailableMessage
};
