import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

const isServer =
  typeof window === 'undefined' || typeof document === 'undefined';

const createAction = (type, action, meta) => (...args) => ({
  type,
  payload: action(...args),
  meta,
});

export { createAction, connect, React, ReactDOM, isServer };
