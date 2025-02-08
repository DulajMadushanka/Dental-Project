import { Map } from "immutable";
import { ModuleEvents } from "./Actions";

const initialState = Map({
  todaySummary: {},
  lastWeekSummary: {}
});

export const Reducer = (state = initialState, action) => {
  const { payload, type, error } = action;

  switch (action.type) {
    case ModuleEvents.GET_DASHBOARD_SUMMARY: {
      console.log("++++++++++++++++++++, payload----", payload)
      if (payload && !payload.error) {
        return state.set("todaySummary", {...payload});
      }
      return state;
    }
    case ModuleEvents.GET_DASHBOARD_LAST_WEEK_SUMMARY: {
      console.log("++++++++++++++++++++, payload----", payload)
      if (payload && !payload.error) {
        return state.set("lastWeekSummary", {...payload});
      }
      return state;
    }
    default:
      return state;
  }
};

export default Reducer;
