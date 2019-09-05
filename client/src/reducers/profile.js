//initial state
import {
  GET_PROFILE,
  PROFILE_ERROR
} from '../actions/Types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}

}

export default function(state=initialState, action){
  const {type, payload} = action;

  switch(type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: true
      }
    default: return state;
  }
}