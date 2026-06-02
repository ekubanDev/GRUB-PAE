import { LatLng } from '../types';

// Default to Accra, Ghana — GRUB-PAE primary market
export const DEFAULT_CENTER: LatLng = {
  lat: 5.6037,
  lng: -0.1870,
};

// Default polygon covers central Accra
export const DEFAULT_POLYGON = [
  { lat: 5.6200, lng: -0.2050 },
  { lat: 5.6200, lng: -0.1690 },
  { lat: 5.5870, lng: -0.1690 },
  { lat: 5.5870, lng: -0.2050 },
];
