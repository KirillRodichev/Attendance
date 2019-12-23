import {AsyncStorage} from 'react-native';

import Student from "../../models/student";

export const DELETE_STUDENT = 'DELETE_STUDENT';
export const SET_STUDENTS = 'SET_STUDENTS';

export const fetchStudents = groupNumber => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(
        `https://foodproject-13e46.firebaseio.com/students/${groupNumber}.json`
      );

      if (!response.ok) {
        throw new Error('students response not ok when fetching classes');
      }
      const responseData = await response.json();

      console.log("STUDENTS RESPONSE");
      console.log(responseData);

      const loadedStudents = [];
      for (const key in responseData) {
        loadedStudents.push(new Student(key, groupNumber));
      }
      //console.log(loadedStudents);
      dispatch({type: SET_STUDENTS, students: loadedStudents});
    } catch (err) {
      throw err;
    }
  };
};

export const deleteStudent = (studentName, groupNumber) => {
  return async (dispatch, getState) => {
    const response = await fetch(
      `https://foodproject-13e46.firebaseio.com/students/${groupNumber}/${studentName}.json`,
      { method: 'DELETE' }
    );
    console.log("DELETE" + studentName);
    if (!response.ok) {
      throw new Error('DELETE_STUDENT: Something went wrong!');
    }
    dispatch({type: DELETE_STUDENT, studentName: studentName, studentGroupNumber: groupNumber});
  };
};