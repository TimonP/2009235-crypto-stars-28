import {
  addMapPointBaloon
} from './add-counterparties-list.js';
import {
  openModal
} from './modal-close-open.js';


const TILE_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ZOOM = 9;

const iconCounterpartyConfig = {
  url: './img/pin.svg',
  width: 36,
  height: 46,
  anchorX: 18,
  anchorY: 46,
};

const iconVerifiedCounterpartyConfig = {
  url: './img/pin-verified.svg',
  width: 36,
  height: 46,
  anchorX: 18,
  anchorY: 46,
};

const startCoordinate = {
  lat: 59.92749,
  lng: 30.31127,
};

const mapElement = document.querySelector('.map');
const map = L.map('map-canvas');

const initMap = () => {
  map.setView(startCoordinate, ZOOM);
  L.tileLayer(TILE_LAYER, {
    attribution: COPYRIGHT
  }).addTo(map);

  mapElement.style.zIndex = '10';
};


const getIconConfiguration = (iconConfiguration) => ({
  iconUrl: iconConfiguration.url,
  iconSize: L.point(iconConfiguration.width, iconConfiguration.height),
  iconAnchor: L.point(iconConfiguration.anchorX, iconConfiguration.anchorY),
});

const iconUser = L.icon(getIconConfiguration(iconCounterpartyConfig));
const iconUserVerified = L.icon(getIconConfiguration(iconVerifiedCounterpartyConfig));

const markerUserGroup = L.layerGroup().addTo(map);
const markerUserVerifiedGroup = L.layerGroup().addTo(map);

const createMarker = (point, markerGroup, iconName) => {
  const {lat, lng} = point.coords;
  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon: iconName,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(addMapPointBaloon(point));
};


const createPoints = (points) => {
  markerUserGroup.clearLayers();
  markerUserVerifiedGroup.clearLayers();
  points.forEach((point) => {
    if (point.status === 'seller') {
      point.paymentMethods.forEach((paymentMethod) => {
        if (paymentMethod.provider === 'Cash in person') {
          if (point.isVerified) {
            createMarker(point, markerUserVerifiedGroup, iconUserVerified);
          } else {
            createMarker(point, markerUserGroup, iconUser);
          }
        }
      });
    }
  });
};


const closeMapPopups = () => {
  map.closePopup();
};


const resetMapSize = () => {
  map.invalidateSize();
};

/*-----------*/
const startOpenModal = (evt) => {
  const counterpartyID = evt.target.closest('.user-card').dataset.counterpartyId;
  openModal(counterpartyID);
};

map.on('popupopen', () => {
  const openedBaloon = document.querySelector('.leaflet-popup');
  const modalOpenElement = openedBaloon.querySelector('.user-card__change-btn');

  modalOpenElement.addEventListener('click', startOpenModal);
});

export {
  createPoints,
  closeMapPopups,
  resetMapSize,
  initMap
};
