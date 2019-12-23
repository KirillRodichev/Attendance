import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  createBottomTabNavigator,
  //DrawerItems
} from 'react-navigation';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';


import ClassesOverviewScreen from '../screens/classes/ClassesOverviewScreen';
import ParticipatedClassesScreen from '../screens/classes/ParticipatedClassesScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import Colors from '../constants/Colors';
import * as authActions from '../redux-store/actions/auth';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.grey100 : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.grey100
};

const ClassesNavigator = createStackNavigator(
  {
    ClassesOverview: ClassesOverviewScreen,
  },
  {
    navigationOptions: {
      title: "Today's schedule",
      tabBarIcon: tabConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-alarm'}
          size={25}
          color={tabConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const ParticipatedClassesNavigator = createStackNavigator(
  {
    ParticipatedClasses: ParticipatedClassesScreen
  },
  {
    navigationOptions: {
      title: "Participated Classes",
      tabBarIcon: tabConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-archive' : 'ios-archive'}
          size={25}
          color={tabConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

/*const ParticipatedClassesNavigator = createStackNavigator(
  {
    ParticipatedClasses: ParticipatedClassesScreen
  },
  {
    navigationOptions: {
      tabBarIcon: tabConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={tabConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);*/

const MainClassesNavigator = createBottomTabNavigator(
  {
    Classes: ClassesNavigator,
    ParticipatedClasses: ParticipatedClassesNavigator,
  },
  {
    tabBarOptions: {
      labelStyle: {
        fontFamily: 'open-sans'
      },
      activeTintColor: Colors.primary
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: MainClassesNavigator
});

export default createAppContainer(MainNavigator);
