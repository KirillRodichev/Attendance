import { PARTICIPATE, SET_PARTICIPATED } from '../actions/participate';

import ParticipatedClass from '../../models/participatedClass';

const initialState = {
  myParticipatedClasses: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PARTICIPATED:
      return {
        myParticipatedClasses: action.participatedClasses
      };
    case PARTICIPATE:
      const newParticipatedClass = new ParticipatedClass(
        action.participatedClassData.name,
        action.participatedClassData.date,
      );
      return {
        ...state,
        myParticipatedClasses: state.myParticipatedClasses.concat(newParticipatedClass)
      };
  }
  return state;
};
