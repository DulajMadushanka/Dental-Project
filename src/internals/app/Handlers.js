import { keyBy, mapValues, transform, mapKeys, concat } from 'lodash';
import { AppModules } from './AppModules';

export const Handlers = mapValues(
  keyBy(AppModules, module => module),
  module => {
    try {
      // eslint-disable-next-line global-require
      const moduleHandler = require(`../../modules/${module}/Handlers`);
      return moduleHandler.default;
    } catch (e) {
      console.warn(e);
      return { default: {} };
    }
  },
);

export const AllHandlers = transform(
  Handlers,
  (result, handler) => {
    mapKeys(handler, (fn, key) => {
      if (key === 'default') {
        return;
      }
      result[key] = result[key] ? concat(result[key], fn) : [fn];
    });
    return result;
  },
  {},
);

export default Handlers;
