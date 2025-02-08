import isPromise from 'is-promise';
import { isFSA } from 'flux-standard-action';
import { Actions } from '../Actions';

const promiseMiddleware = ({ dispatch }) => next => action => {
  if (!isFSA(action)) {
    return isPromise(action) ? action.then(dispatch) : next(action);
  }

  const isLoadingAction = action.meta && action.meta.loading;
  if (isPromise(action.payload)) {
    if (isLoadingAction) {
      dispatch(Actions.common.loadingStarted(action));
    }
    return action.payload
      .then(result => {
        dispatch({ ...action, payload: result });
        if (isLoadingAction) {
          dispatch(Actions.common.loadingFinished(action));
        }
      })
      .catch(error => {
        dispatch({ ...action, payload: error, error: true });
        if (isLoadingAction) {
          dispatch(Actions.common.loadingFinished(action));
        }
        return Promise.reject(error);
      });
  }
  return next(action);
};

export default promiseMiddleware;
