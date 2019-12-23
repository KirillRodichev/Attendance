import { AUTHENTICATE, LOGOUT, PSEUDO_AUTHENTICATE } from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
      };
    case PSEUDO_AUTHENTICATE:
      return {
        email: action.email,
        password: action.password,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
