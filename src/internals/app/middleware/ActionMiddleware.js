import _ from 'lodash';
import { AllHandlers } from '../Handlers';
import { appHistory } from '../Store';

/**
 * bind the handlers
 */
export const actionMiddleware = () => ({
  dispatch,
  getState,
}) => next => action => {
  const handlers = AllHandlers[action.type];
  const { error } = action;

  if (error) {
    if (error.code) {
      // logger.error(`Unhandled probable network error in ${type} : ${JSON.stringify(error)} `)
    } else {
      // logger.warn(`Unhandled error in ${type} : ${JSON.stringify(error)} `)
      //}
    }
  }

  const nextAction = next(action);

  _.forEach(handlers, handler => {
    handler({
      dispatch,
      payload: action.payload,
      appState: getState(),
      error,
      pathname: appHistory.location.pathname,
    });
  });

  return nextAction;
};

export default actionMiddleware;
