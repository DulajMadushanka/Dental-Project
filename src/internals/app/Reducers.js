import { keyBy, mapValues } from "lodash";
import { AppModules } from "./AppModules";

const Reducers = mapValues(
  keyBy(AppModules, (module) => module),
  (module) => {
    const reducer = require(`../../modules/${module}/Reducer`);
    return reducer.Reducer;
  }
);
export default Reducers;
