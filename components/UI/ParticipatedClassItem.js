import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Card from "./Card";
import Colors from "../../constants/Colors";
import LinearGradient from "expo-linear-gradient/build/LinearGradient";

const ParticipatedClassItem = props => {
  return (
    <Card style={styles.itemContainer}>
      <LinearGradient colors={['#00FFCB', '#00F2FF']}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.date}>{props.date}</Text>
        </View>
      </LinearGradient>
    </Card>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    margin: 20,
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  name: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  date: {
    fontFamily: 'open-sans',
    fontSize: 16,
    color: Colors.grey180
  },
});

export default ParticipatedClassItem;
