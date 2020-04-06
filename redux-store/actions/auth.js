import {AsyncStorage} from 'react-native';

import * as studentsActions from "../actions/students";
import Firebase from "../../constants/Firebase";

export const AUTHENTICATE = 'AUTHENTICATE';
export const PSEUDO_AUTHENTICATE = 'PSEUDO_AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
        type: AUTHENTICATE,
        userId: userId,
        token: token,
    });
  };
};

export const pseudoAuthenticate = (email, password) => {
  return dispatch => {
    dispatch({
        type: PSEUDO_AUTHENTICATE,
        email: email,
        password: password,
      })
    ;
  };
};

export const signup = (email, password, userName) => {
  return async dispatch => {
    const response = await fetch(
      `${ Firebase.authURL }v1/accounts:signUp?key=${ Firebase.authKey }`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Think more!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    await dispatch(studentsActions.deleteStudent(userName, "6311"));
    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000,
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(
      resData.idToken,
      resData.localId,
      expirationDate,
      email,
      password,
      userName,
    );
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      `${ Firebase.authURL }v1/accounts:signInWithPassword?key=${ Firebase.authKey }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000,
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(
      resData.idToken,
      resData.localId,
      expirationDate,
      email,
      password,
    );
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return {type: LOGOUT};
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
      //dispatch(login(email, password))
    }, expirationTime); // 1000 is just to make sure it works
  };
};

const saveDataToStorage = (
  token, userId, expirationDate, email, password, userName, userPassword
) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
      email: email,
      password: password,
      userName: userName,
      userPassword: userPassword,
    })
  );
};

