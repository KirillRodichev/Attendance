import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import ClassesNavigator from './ClassesNavigator';
import {AsyncStorage} from "react-native";

const NavigationContainer = props => {
  const navRef = useRef();

  useEffect(() => {
    let transformedData = null;
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        transformedData = JSON.parse(userData);
      }
    };
    getUserData();

    const redirect = async () => {
      await getUserData();
      if (!transformedData) {
        navRef.current.dispatch(
          NavigationActions.navigate({ routeName: 'Auth' })
        )
      }
    };

    redirect();
  });

  return <ClassesNavigator ref={navRef} />;
};

export default NavigationContainer;
