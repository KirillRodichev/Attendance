import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Image,
  Picker,
  Text
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import * as authActions from '../../redux-store/actions/auth';
import * as superClassesActions from "../../redux-store/actions/classes";

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AuthScreen = props => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ pickerVisible, setPickerVisible ] = useState(false);
  const [ error, setError ] = useState();
  const [ isSignup, setIsSignup ] = useState(false);
  const availableStudents = useSelector(state => state.studentsReducer.availableStudents);
  const [ studentsNames, setStudentsNames ] = useState({
    names: [],
    name: ""
  });
  const dispatch = useDispatch();

  const pickerChange = (index) => {
    for (const key in studentsNames.names) {
      if (parseInt(key, 10) === index) {
        setStudentsNames({
          names: studentsNames.names,
          name: studentsNames.names[index],
        })
      }
    }
  };

  const [ formState, dispatchFormState ] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      userName: '',
    },
    inputValidities: {
      email: false,
      password: false,
      userName: false,
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [ { text: 'Okay' } ]);
    }
  }, [ error ]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password,
        studentsNames.name,
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      await dispatch(superClassesActions.fetchClasses());
      props.navigation.navigate('Classes');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [ dispatchFormState ]
  );

  return (
    <KeyboardAvoidingView behavior="padding">
      <View style={ [ styles.imageContainer, { backgroundColor: pickerVisible ? Colors.grey220 : "#fff" } ] }>
        <View style={ { width: 150, height: 150 } }>
          <Image
            style={ { width: '100%', height: '100%' } }
            source={ require('../../assets/falcon.png') }
          />
        </View>
        <View style={ { width: '70%', maxWidth: 400 } }>
          { isSignup ? (
            <View>
              <View>
                { availableStudents.length === 0
                  ? (
                    <View style={ styles.centered }>
                      <ActivityIndicator size="small" color={ Colors.primary }/>
                    </View>
                  )
                  : (
                    <View>
                      <Button
                        title={ pickerVisible ? "Yeah! This is me" : "Pick a name" }
                        onPress={ () => {
                          setStudentsNames({
                            names: availableStudents.map((student) => {
                              return student.name;
                            }),
                            name: studentsNames.name,
                          });
                          pickerVisible ? setPickerVisible(false) : setPickerVisible(true);
                        } }
                      />
                      <View style={ styles.nameField }>
                        <Text style={ { fontFamily: 'open-sans', } }>
                          Name
                        </Text>
                        <Text style={ {
                          fontFamily: 'open-sans',
                          marginTop: 10,
                          height: 25,
                          fontSize: 16
                        } }>
                          { studentsNames.name ? studentsNames.name : "" }
                        </Text>
                      </View>
                    </View>
                  ) }
              </View>
            </View>
          ) : (
            null
          ) }
          <Input
            id="email"
            label="E-Mail"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            errorText="Please enter a valid email address."
            onInputChange={ inputChangeHandler }
            initialValue=""
          />
          <Input
            id="password"
            label="Password"
            keyboardType="default"
            secureTextEntry
            required
            minLength={ 5 }
            autoCapitalize="none"
            errorText="Please enter a valid password."
            onInputChange={ inputChangeHandler }
            initialValue=""
          />
        </View>
        <View>
          { isLoading ? (
            <ActivityIndicator size="small" color={ Colors.primary }/>
          ) : (
            <Button
              title={ isSignup ? 'Sign Up' : 'Login' }
              color={ Colors.primary }
              onPress={ authHandler }
            />
          ) }
        </View>
        <View>
          <Button
            title={ `Switch to ${ isSignup ? 'Login' : 'Sign Up' }` }
            color={ Colors.grey100 }
            onPress={ () => {
              setIsSignup(prevState => !prevState);
            } }
          />
        </View>

        { isSignup
          ? (
            <View style={ [ styles.pickerContainer, { zIndex: pickerVisible ? 111 : -1 } ] }>
              { pickerVisible
                ? (
                  <Picker
                    style={ { backgroundColor: "#fff" } }
                    selectedValue={ studentsNames.name }
                    onValueChange={ (itemValue, itemIndex) => pickerChange(itemIndex) }
                  >
                    {
                      studentsNames.names.map((name) => {
                        return <Picker.Item label={ name } value={ name }/>
                      })
                    }
                  </Picker>
                )
                : null
              }
            </View>
          ) : null }
      </View>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: 'Authentication'
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 100,
  },
  nameField: {
    flexDirection: 'column',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d6d6d6'
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  }
});

export default AuthScreen;
