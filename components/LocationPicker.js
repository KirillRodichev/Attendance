import React, {useState} from 'react';
import {
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const verifyPermissions = async () => {
  const result = await Permissions.askAsync(Permissions.LOCATION);
  if (result.status !== 'granted') {
    Alert.alert(
      'Insufficient permissions!',
      'You need to grant location permissions to use this app.',
      [{text: 'Okay'}]
    );
    return false;
  }
  return true;
};

export const getLocationHandler = async () => {
  const hasPermission = await verifyPermissions();
  let coords = [];
  if (!hasPermission) {
    return;
  }
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation
    });
    coords.push(location.coords.latitude);
    coords.push(location.coords.longitude);
  } catch (err) {
    Alert.alert(
      'Could not fetch location!',
      'Please try again later or pick a location on the map.',
      [{text: 'Okay'}]
    );
  }
  return coords;
};
