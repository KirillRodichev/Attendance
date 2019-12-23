import {AsyncStorage} from 'react-native';

import Time from '../../constants/Time';
import University from '../../constants/University';
import * as LocationPicker from "../../components/LocationPicker";
import ParticipatedClass from "../../models/participatedClass";

export const PARTICIPATE = 'PARTICIPATE';
export const SET_PARTICIPATED = 'SET_PARTICIPATED';

export const fetchParticipatedClasses = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `https://foodproject-13e46.firebaseio.com/participatedClasses/${userId}.json`
      );
      if (!response.ok) {
        throw new Error('Something went wrong when fetching participated classes!');
      }
      const resData = await response.json();

      console.log("FETCHED PARTICIPATED");
      console.log(resData);

      const loadedParticipatedClasses = [];
      console.log("For result: ");
      for (const key in resData) {
        loadedParticipatedClasses.push(new ParticipatedClass(resData[key].name, resData[key].date));
      }
      dispatch({type: SET_PARTICIPATED, participatedClasses: loadedParticipatedClasses});
    } catch (err) {
      throw err;
    }
  };
};

const checkIfInTime = (classItem, date) => {
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

  console.log(
    "\ncurrentDate: " + date +
    "\nlessonStarts: " + startDate +
    "\nlessonEnds: " + endDate
  );

  return startDate < date && endDate > date;
};

const distance = (lat, lon) => {
  let p = 0.017453292519943295;
  let c = Math.cos;
  let a = 0.5 - c((University.lat - lat) * p) / 2 +
    c(lat * p) * c(University.lat * p) *
    (1 - c((University.lng - lon) * p)) / 2;
  return 12742 * Math.asin(Math.sqrt(a)) * 1000;
};

export const participate = (classItem) => {
    return async (dispatch, getState) => {
      const userId = getState().authReducer.userId;
      let coords = [];
      const date = new Date();
      let response = null;

      console.log("COORDS FROM DB:");
      console.log("lat: ", classItem.lat, "lng: ", classItem.lng);

      const getCoords = async () => {
        coords = await LocationPicker.getLocationHandler();
        console.log("coords: " + coords);
      };

      const getResponse = async () => {
        await getCoords();
        if (coords.length !== 0) {
          /*
          change if to real (distance(coords[0], coords[1]) < 10 && checkIfInTime(classItem, date))
           */
          if (true) {
            console.log("DISTANCE: " + distance(coords[0], coords[1]));
            response = await fetch(
              `https://foodproject-13e46.firebaseio.com/participatedClasses/${userId}.json`,
              {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: classItem.name, date: date.toISOString()})
              }
            );
          } else if (distance(coords[0], coords[1]) > 10) {
            throw new Error("The distance to the class is too big: " + distance(coords[0], coords[1]).toFixed(1) + "m");
          } else if (!checkIfInTime(classItem, date)) {
            throw new Error("Time of request doesn't match the time of the class");
          }
        }
      };

      try {
        await getResponse();
      } catch (e) {
        throw new Error(e.message);
      }

      /*
      REAL DISPATCH IN COMMENTS
       */
      dispatch({
        type: PARTICIPATE,
        participatedClassData: {
          name: response ? classItem.name : null,
          date: response ? date : null
        }
      });
      /*dispatch({
        type: PARTICIPATE,
        participatedClassData: {
          name: classItem.name,
          date: date
        }
      });*/
      await saveDataToStorage(classItem.name);
    };


};

let storageData = [];

const saveDataToStorage = async (className) => {
  await AsyncStorage.removeItem('participatedClassesNames');
  /*const storageItems = await AsyncStorage.getItem('participatedClassesNames');
  if (typeof storageItems !== 'undefined' && storageItems !== null) {
    storageData.concat(storageItems);
  }
  storageData.push(className);
  AsyncStorage.setItem(
    'participatedClassesNames',
    JSON.stringify(storageData)
  );*/
};
