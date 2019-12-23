import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';

import authReducer from './redux-store/reducers/auth';
import participateReducer from './redux-store/reducers/participate';
import classesReducer from "./redux-store/reducers/classes";
import studentsReducer from "./redux-store/reducers/students";
import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
  participateReducer: participateReducer,
  authReducer: authReducer,
  classesReducer: classesReducer,
  studentsReducer: studentsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
