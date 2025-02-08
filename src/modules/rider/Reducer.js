import { Map } from "immutable";
import { ModuleEvents } from "./Actions";

const initialState = Map({
  riderList: [],
});

export const Reducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ModuleEvents.FETCH_ALL_RIDERS: {
      if (payload && !payload.error) {
        return state.set("riderList", [...payload]);
      }
      return state;
    }

    default:
      return state;
  }
};

export default Reducer;
