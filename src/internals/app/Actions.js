import { keyBy, mapValues } from 'lodash';
import { AppModules } from './AppModules';

export const Actions = mapValues(
  keyBy(AppModules, module => module),
  module => {
    const actions = require(`../../modules/${module}/Actions`);
    return actions.default;
  },
);
