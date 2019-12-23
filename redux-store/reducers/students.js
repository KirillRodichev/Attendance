import {SET_STUDENTS, DELETE_STUDENT} from "../actions/students";

const initialState = {
  availableStudents: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_STUDENTS:
      return {
        availableStudents: action.students,
      };
    case DELETE_STUDENT:
      return {
        ...state,
        availableStudents: state.availableStudents.filter(student => student.name !== student.studentName)
      };
  }
  return state;
};