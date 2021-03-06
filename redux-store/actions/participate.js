import { AsyncStorage } from 'react-native';

import Time from '../../constants/Time';
import Firebase from "../../constants/Firebase";
import * as LocationPicker from "../../components/LocationPicker";
import ParticipatedClass from "../../models/participatedClass";

export const PARTICIPATE = 'PARTICIPATE';
export const SET_PARTICIPATED = 'SET_PARTICIPATED';

export const fetchParticipatedClasses = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `${ Firebase.databaseURL }participatedClasses/${ userId }.json`
      );
      if (!response.ok) {
        throw new Error('Something went wrong when fetching participated classes!');
      }
      const resData = await response.json();

      const loadedParticipatedClasses = [];
      for (const key in resData) {
        loadedParticipatedClasses.push(new ParticipatedClass(resData[key].name, resData[key].date));
      }
      dispatch({ type: SET_PARTICIPATED, participatedClasses: loadedParticipatedClasses });
    } catch (err) {
      throw err;
    }
  };
};

const ifInTime = (classItem, date) => {
  let startTime = Time[classItem.orderNumber][0];
  let endTime = Time[classItem.orderNumber][1];
  let startDate = new Date(date.getTime());

  startDate.setHours(startTime.split(":")[0]);
  startDate.setMinutes(startTime.split(":")[1]);
  startDate.setSeconds(startTime.split(":")[2]);

  let endDate = new Date(date.getTime());

  endDate.setHours(endTime.split(":")[0]);
  endDate.setMinutes(endTime.split(":")[1]);
  endDate.setSeconds(endTime.split(":")[2]);

  return (startDate < date) && (endDate > date);
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  let p = 0.017453292519943295;
  let c = Math.cos;
  let a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p)) / 2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000;
};

export const participate = (classItem) => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    let coords = [];
    const date = new Date();
    let response = null;

    const getCoords = async () => {
      coords = await LocationPicker.getLocationHandler();
    };

    const getResponse = async () => {
      await getCoords();
      if (coords.length !== 0) {
        const distance = getDistance(coords[0], coords[1], classItem.lat, classItem.lng);
        if (distance <= 10 && ifInTime(classItem, date)) {
          response = await fetch(
            `${ Firebase.databaseURL }participatedClasses/${ userId }.json`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: classItem.name, date: date.toISOString() })
            }
          );
        } else if (!ifInTime(classItem, date)) {
          throw new Error("Time of request doesn't match the time of the class. getDistance to the class: " 
            + distance.toFixed(1) + "m");
        } else if (distance > 10) {
          throw new Error("The getDistance to the class is too big: " 
            + distance.toFixed(1) + "m");
        }
      }
    };

    try {
      await getResponse();
    } catch (e) {
      throw new Error(e.message);
    }

    dispatch({
      type: PARTICIPATE,
      participatedClassData: {
        name: response ? classItem.name : null,
        date: response ? date : null
      }
    });
    await saveDataToStorage(classItem.name);
  };
};

let storageData = [];

const saveDataToStorage = async (className) => {
  //await AsyncStorage.removeItem('participatedClassesNames');
  const storageItems = await AsyncStorage.getItem('participatedClassesNames');
  if (typeof storageItems !== 'undefined' && storageItems !== null) {
    storageData.concat(storageItems);
  }
  storageData.push(className);
  AsyncStorage.setItem(
    'participatedClassesNames',
    JSON.stringify(storageData)
  );
};
