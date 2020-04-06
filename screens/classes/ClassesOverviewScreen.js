import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import ClassItem from '../../components/UI/ClassItem';
import Colors from '../../constants/Colors';

import * as classesActions from '../../redux-store/actions/classes';
import * as participateActions from '../../redux-store/actions/participate';

const ClassesOverviewScreen = () => {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isRefreshing, setIsRefreshing ] = useState(false);
  const [ error, setError ] = useState();
  const [ isButtonLoading, setIsButtonLoading ] = useState(false);
  const myClasses = useSelector(state => state.classesReducer.availableClasses);
  const dispatch = useDispatch();

  const loadClasses = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(classesActions.fetchTodayClasses());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [ dispatch, setIsLoading, setError ]);

  const participateClassHandler = async item => {
    let participated = false;
    Alert.alert(
      'Are you sure?',
      'Do you really want to participate the class',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsButtonLoading(true);
            try {
              await dispatch(participateActions.participate(item));
              participated = true;
            } catch (e) {
              setTimeout(() => Alert.alert(
                "You can't participate the class",
                e.message,
                [ { text: 'Ok', style: 'cancel' } ]
              ), 1000);
            }
            setIsButtonLoading(false);
            if (participated) {
              await dispatch(classesActions.finishClass(item.name));
              setTimeout(() => Alert.alert(
                "Participated!",
                "You can check it in Participated Classes",
                [ { text: 'Ok', style: 'cancel' } ]
              ), 1000);
            }
          }
        }
      ]);
  };

  useEffect(() => {
    setIsLoading(true);
    loadClasses().then(() => {
      setIsLoading(false);
    });
  }, [ dispatch, loadClasses ]);

  if (error) {
    return (
      <View style={ styles.centered }>
        <Text>An error occurred, when loading classes. May be classes doesn't exist</Text>
        <Button
          title="Try again"
          onPress={ loadClasses }
          color={ Colors.primary }
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={ styles.centered }>
        <ActivityIndicator size="large" color={ Colors.primary }/>
      </View>
    );
  }

  if (!isLoading && myClasses.length === 0) {
    return (
      <View style={ styles.centered }>
        <Text>No classes found! may be they are not added</Text>
      </View>
    );
  }

  return (
    <View style={ { flex: 1 } }>
      { isButtonLoading ? (
        <Modal
          visible={ isButtonLoading }
          animationType='slide'
          presentationStyle="formSheet"
        >
          <View style={ styles.loader }>
            <ActivityIndicator size="large" color={ Colors.primary }/>
            <Text style={ { marginTop: 20 } }>Please wait, we're getting your location</Text>
          </View>
        </Modal>
      ) : (
        null
      ) }
      <FlatList
        onRefresh={ loadClasses }
        refreshing={ isRefreshing }
        data={ myClasses }
        keyExtractor={ item => item.name }
        renderItem={ itemData => (
          <ClassItem
            name={ itemData.item.name }
            cabinet={ itemData.item.cabinet }
            teacher={ itemData.item.teacher }
            type={ itemData.item.type }
            onSelect={ () => {
            } }
          >
            <TouchableOpacity
              style={ styles.enterButton }
              onPress={ () => {
                participateClassHandler(itemData.item);
              } }
            >
              <Text style={ styles.buttonText }>Enter class</Text>
            </TouchableOpacity>
          </ClassItem>
        ) }
      />
    </View>

  );
};

ClassesOverviewScreen.navigationOptions = () => {
  return {
    headerTitle: "Today's schedule ",
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backgroundContainer: {
    width: '100%',
    height: '100%',
  },
  enterButton: {
    width: '80%',
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.primary,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'open-sans',
    marginHorizontal: 30,
    color: Colors.primary
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
});

export default ClassesOverviewScreen;
