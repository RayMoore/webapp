import * as ActionTypes from "./ActionTypes";
import { SecureStore, Localization } from "expo";
import * as LocalKeys from "../../common/localKeys";

export const finishAppInitialize = () => dispatch => {
  console.log("finish app initialize");
  dispatch(appInitialized(true));
};

export const getAppLocale = () => dispatch => {
  return SecureStore.getItemAsync(LocalKeys.APP_LOCALE)
    .then(lang => {
      dispatch(appLocale(lang ? lang : Localization.locale));
    })
    .catch(err => {
      console.log(err);
      dispatch(appLocale(Localization.locale));
    });
};

export const setAppLocale = localeString => dispatch => {
  return SecureStore.setItemAsync(LocalKeys.APP_LOCALE, localeString)
    .then(() => {
      dispatch(updateAppLocale(localeString));
    })
    .catch(err => {
      console.log(err);
    });
};

export const appInitialized = bool => ({
  type: ActionTypes.APP_FINISH_INIT,
  payload: bool
});

export const appLocale = locale => ({
  type: ActionTypes.SET_APP_LOCALE,
  payload: locale
});

export const updateAppLocale = localeString => ({
  type: ActionTypes.UPDATE_APP_LOCALE,
  payload: localeString
});
