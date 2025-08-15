import { ComponentType } from 'react';
import { LoadScript, GoogleMap, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

declare module '@react-google-maps/api' {
  export const LoadScript: ComponentType<any>;
  export const GoogleMap: ComponentType<any>;
  export const Marker: ComponentType<any>;
  export const InfoWindow: ComponentType<any>;
  export const DirectionsRenderer: ComponentType<any>;
} 