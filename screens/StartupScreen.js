import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  AsyncStorage,
  Button,
  Image
} from 'react-native';
import {useDispatch} from 'react-redux';

import * as authActions from '../redux-store/actions/auth';
import * as LocalAuthentication from "expo-local-authentication";
import Colors from "../constants/Colors";
import * as superClassesActions from "../redux-store/actions/classes";
import * as studentsActions from "../redux-store/actions/students";

let userInfo = {
  name: null,
};

const StartupScreen = props => {
  const dispatch = useDispatch();

  const scanFingerPrint = async () => {
    try {
      let results = await LocalAuthentication.authenticateAsync();
      if (results.success) {
        props.navigation.navigate('Classes');
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        await dispatch(studentsActions.fetchStudents("6311"));
        props.navigation.navigate('Auth');
        return;
      }

      const transformedData = JSON.parse(userData);

      const {token, userId, expiryDate, email, password, userName, userGroup} = transformedData;
      userInfo.name = userName;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date()) {
        dispatch(authActions.pseudoAuthenticate(email, password));
        await dispatch(studentsActions.fetchStudents("6311"));
        props.navigation.navigate('Auth');
      } else if (!token || !userId) {
        await dispatch(studentsActions.fetchStudents("6311"));
        props.navigation.navigate('Auth');
      } else {
        const expirationTime = expirationDate.getTime() - new Date().getTime();
        dispatch(authActions.authenticate(userId, token, expirationTime));
        await dispatch(superClassesActions.fetchClasses());
      }
    };
    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={{width: 150, height: 150}}>
        <Image
          style={{width: '100%', height: '100%'}}
          source={require('../assets/falcon.png')}
        />
      </View>
      <Button
        title="Authentication with finger print"
        color={Colors.primary}
        onPress={() => {
          //clearState();
          scanFingerPrint();
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  userName: {
    fontSize: 22,
    paddingTop: 20,
    fontFamily: 'open-sans-bold',
  },
  button: {
    width: '60%',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: Colors.grey180,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'open-sans-bold',
    marginHorizontal: 30,
    color: Colors.grey220
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
  },
});

export default StartupScreen;
