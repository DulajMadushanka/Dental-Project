import React from "react";
import Reducers from "./Reducers";
import logger from "redux-logger";
import { isServer } from "./AppUtils";
import { syncHistory } from "redux-simple-router";
import { routerMiddleware } from "react-router-redux";
import actionMiddleware from "./middleware/ActionMiddleware";
import PromiseMiddleware from "./middleware/PromiseMiddleware";
import { createBrowserHistory, createMemoryHistory } from "history";
import { compose, createStore, combineReducers, applyMiddleware } from "redux";

const appHistory = isServer
  ? createMemoryHistory()
  : createBrowserHistory({
      forceRefresh: false, // Set true to force full page refreshes
      keyLength: 2, // The length of location.key
    });

const reduxRouterMiddleware = syncHistory(appHistory);
const rootReducer = combineReducers({
  ...Reducers,
});

const routeMiddleware = routerMiddleware(appHistory);

const enhancer = compose(
  applyMiddleware(
    PromiseMiddleware,
    logger,
    actionMiddleware(),
    //reduxRouterMiddleware,
    routeMiddleware
  )
);

const store = createStore(rootReducer, {}, enhancer);

//InitApp(store);

export { appHistory, store };
