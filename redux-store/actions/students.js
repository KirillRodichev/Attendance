import Student from "../../models/student";
import Firebase from '../../constants/Firebase';

export const DELETE_STUDENT = 'DELETE_STUDENT';
export const SET_STUDENTS = 'SET_STUDENTS';

export const fetchStudents = groupNumber => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${ Firebase.databaseURL }students/${groupNumber}.json`
      );

      if (!response.ok) {
        throw new Error('students response not ok when fetching classes');
      }
      const responseData = await response.json();

      const loadedStudents = [];
      for (const key in responseData) {
        loadedStudents.push(new Student(key, groupNumber));
      }

      dispatch({type: SET_STUDENTS, students: loadedStudents});
    } catch (err) {
      throw err;
    }
  };
};

export const deleteStudent = (studentName, groupNumber) => {
  return async (dispatch) => {
    const response = await fetch(
      `${ Firebase.databaseURL }students/${groupNumber}/${studentName}.json`,
      { method: 'DELETE' }
    );
    if (!response.ok) {
      throw new Error('DELETE_STUDENT: Something went wrong!');
    }
    dispatch({type: DELETE_STUDENT, studentName: studentName, studentGroupNumber: groupNumber});
  };
};