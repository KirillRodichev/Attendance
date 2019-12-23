import {
  SET_SUPERCLASS, FINISH_CLASS, SET_CLASSES
} from '../actions/classes';

const initialState = {
  availableClasses: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SUPERCLASS:
      return {
        availableClasses: action.superClasses,
      };
    case SET_CLASSES:
      return {
        availableClasses: action.todayClasses,
      };
    case FINISH_CLASS:
      return {
        ...state,
        availableClasses: state.availableClasses.filter(
          myClass => myClass.name !== myClass.className
        )
      };
  }
  return state;
};