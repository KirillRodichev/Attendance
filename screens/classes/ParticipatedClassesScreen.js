import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Platform,
  AsyncStorage
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import ParticipatedClassItem from '../../components/UI/ParticipatedClassItem';
import Colors from "../../constants/Colors";
import * as participateActions from "../../redux-store/actions/participate";

const ParticipatedClassesScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const participatedClassesItems = useSelector(state => state.participateReducer.myParticipatedClasses);
  const dispatch = useDispatch();

  const loadClasses = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(participateActions.fetchParticipatedClasses());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadClasses().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadClasses]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred, when loading classes. May be classes doesn't exist</Text>
        <Button
          title="Try again"
          onPress={loadClasses}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary}/>
      </View>
    );
  }

  if (!isLoading && participatedClassesItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>You haven't participated any classes yet!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadClasses}
      refreshing={isRefreshing}
      data={participatedClassesItems}
      keyExtractor={item => item.name}
      renderItem={itemData => (
        <ParticipatedClassItem
          name={itemData.item.name}
          date={itemData.item.date.toLocaleString()}
        />
      )}
    />
  );
};

ParticipatedClassesScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Participated Classes',
  };
};

const styles = StyleSheet.create({
  centered: {justifyContent: 'center', alignItems: 'center', flex: 1}
});

export default ParticipatedClassesScreen;
