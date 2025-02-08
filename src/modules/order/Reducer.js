import { Map } from "immutable";
import { ModuleEvents } from "./Actions";
import _ from 'lodash';

const initialState = Map({
  orderListData: {
    items: [],
    nextLastKey: null,
    lastKeyList: [],
    totalCount: 0,
  },

});

export const Reducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ModuleEvents.FETCH_ALL_ORDERS: {
      let orderListData = state.get('orderListData');
      if (payload && !payload.error) {
        orderListData.items = payload.items;
        orderListData.nextLastKey = payload.lastKey;
      }

      return state.set('orderListData', {...orderListData});
    }

    case ModuleEvents.FETCH_PAGINATE_ALL_ORDERS: {
      let orderListData = state.get('orderListData');
      if (payload?.result && !payload?.result?.error) {
        const { type, result } = payload;

        console.log("++++++++++++++++++++payload, payload", payload)

        if (type === 'NEXT') {
          if (result.items.length > 0) {
            orderListData.lastKeyList.push(orderListData.nextLastKey);
          }
        } else {
          orderListData.lastKeyList.splice(
            orderListData.lastKeyList.length - 1,
            1,
          );
        }

        if (result?.items?.length > 0) {
          orderListData.items = result.items;
        }

        orderListData.nextLastKey = result.lastKey;
      }

      return state.set('orderListData', {...orderListData});
    }

    default:
      return state;
  }
};

export default Reducer;
