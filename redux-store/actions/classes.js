import {AsyncStorage} from 'react-native';

import UniversityClass from '../../models/universityClass';

export const FINISH_CLASS = 'FINISH_CLASS';
export const SET_SUPERCLASS = 'SET_SUPERCLASS';
export const SET_CLASSES = 'SET_CLASSES';

const pushToClass = (where, key, data) => {
  where.push(
    new UniversityClass(
      key,
      data[key].cabinet,
      data[key].orderNumber,
      data[key].teacher,
      data[key].type,
      data[key].lat,
      data[key].lng
    )
  );
};

const getDayString = dayNumber => {
  switch (dayNumber) {
    case 1:
      return "mon";
    case 2:
      return "tue";
    case 3:
      return "wed";
    case 4:
      return "thu";
    case 5:
      return "fri";
    case 6:
      return "sat";
    case 7:
      return "sun";
  }
};

const getWeekType = dayNumber => {
  if (dayNumber > 0 && dayNumber < 8 || dayNumber > 14 && dayNumber < 22 || dayNumber > 28) {
    return "evenWeek";
  } else
    return "oddWeek";
};

export const fetchClasses = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    const date = new Date();
    const weekType = getWeekType(date.getDay());
    //const dayOfWeek = getDayString(date.getDay());
    const dayOfWeek = "wed";
    try {
      const response = await fetch(
        `https://foodproject-13e46.firebaseio.com/schedule/${weekType}/${dayOfWeek}.json`
      );
      const participatedClassesResponse = JSON.parse(await AsyncStorage.getItem('participatedClassesNames'));
      if (!response.ok) {
        throw new Error('classes response not ok when fetching classes');
      }
      const responseData = await response.json();
      const loadedClasses = [];
      for (const key in responseData) {
        if (participatedClassesResponse !== null) {
          if (!participatedClassesResponse.includes(key)) {
            pushToClass(loadedClasses, key, responseData);
          } else delete responseData[key];
        } else {
          pushToClass(loadedClasses, key, responseData);
        }
      }
      const responseNew = await fetch(
        `https://foodproject-13e46.firebaseio.com/todaySchedule/${userId}.json`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({todayClasses: responseData})
        }
      );
      dispatch({type: SET_SUPERCLASS, superClasses: loadedClasses,});
    } catch (err) {
      throw err;
    }
  };
};

export const fetchTodayClasses = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `https://foodproject-13e46.firebaseio.com/todaySchedule/${userId}/todayClasses.json`
      );
      const participatedClassesResponse = JSON.parse(await AsyncStorage.getItem('participatedClassesNames'));
      if (!response.ok) {
        throw new Error('classes response not ok when fetching today classes');
      }
      const responseData = await response.json();
      const loadedTodayClasses = [];
      for (const key in responseData) {
        if (participatedClassesResponse !== null) {
          if (!participatedClassesResponse.includes(key)) {
            pushToClass(loadedTodayClasses, key, responseData);
          }
        } else {
          pushToClass(loadedTodayClasses, key, responseData);
        }
      }
      dispatch({type: SET_CLASSES, todayClasses: loadedTodayClasses,});
    } catch (err) {
      throw err;
    }
  };
};

export const finishClass = className => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    const response = await fetch(
      `https://foodproject-13e46.firebaseio.com/todaySchedule/${userId}/todayClasses/${className}.json`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      throw new Error('FINISH_CLASS: Something went wrong!');
    }
    dispatch({type: FINISH_CLASS, className: className});
  };
};