import * as ActionTypes from "../actions/ActionTypes";

export const feed = (
  state = {
    homeFeed: [],
    uploading: false
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.RELOAD_HOME_FEED:
      return { ...state, homeFeed: action.payload };
    case ActionTypes.UPDATE_HOME_FEED:
      return { ...state, homeFeed: state.homeFeed.concat(action.payload) };
    case ActionTypes.ADD_TO_HEAD_HOME_FEED:
      return { ...state, homeFeed: action.payload.concat(state.homeFeed) };
    case ActionTypes.UPLOADING_POST:
      return { ...state, uploading: true };
    case ActionTypes.UPLOADED_POST:
      return { ...state, uploading: false };
    default:
      return state;
  }
};
