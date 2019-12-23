import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform, ActivityIndicator
} from 'react-native';

import Card from './Card';
import Colors from "../../constants/Colors";

const ClassItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.itemContainer}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{props.name}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTextItem}>{props.cabinet}</Text>
              <Text style={styles.descriptionTextItem}>{props.teacher}</Text>
              <Text style={styles.descriptionTextItem}>{props.type}</Text>
            </View>
            <View style={styles.actions}>
              {props.children}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: 140,
    margin: 20
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  name: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
  },
  nameContainer: {
    justifyContent: 'flex-start', alignItems: 'center', marginTop: 20
  },
  descriptionContainer: {
    flexDirection: 'column', justifyContent: 'space-between', marginTop: 10, marginHorizontal: 30
  },
  descriptionTextItem: {
    fontFamily: 'open-sans',
    fontSize: 14,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  }
});

export default ClassItem;
