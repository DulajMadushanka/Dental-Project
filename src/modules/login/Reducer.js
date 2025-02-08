import _, { get } from "lodash";
import { Map } from "immutable";
import { ModuleEvents } from "./Actions";

const initialState = Map({
  currentUser: {},
});

export const Reducer = (state = initialState, action) => {
  const { payload, type, error } = action;

  switch (action.type) {
    case ModuleEvents.LOG_OUT: {
      return initialState;
    }

    case ModuleEvents.GET_CURRENT_USER: {
      console.log("++++++++++++++++++++, payload----", payload)
      if (payload && !payload.error) {
        return state.set("currentUser", {...payload});
      }
      return state;
    }

    default:
      return state;
  }
};

export default Reducer;
