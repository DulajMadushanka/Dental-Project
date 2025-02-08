import { Map } from "immutable";
import { ModuleEvents } from "./Actions";
import _ from 'lodash';

const initialState = Map({
  withdrawalListData: {
    items: [],
    nextLastKey: null,
    lastKeyList: [],
    totalCount: 0,
  },
  companyWithdrawalListData: {
    items: [],
    nextLastKey: null,
    lastKeyList: [],
    totalCount: 0,
  },
});

export const Reducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ModuleEvents.FETCH_WITHDRAWAL_REQUESTS: {
      let withdrawalListData = state.get('withdrawalListData');
      if (payload && !payload.error) {
        withdrawalListData.items = payload.items;
        withdrawalListData.nextLastKey = payload.lastKey;
      }

      return state.set('withdrawalListData', {...withdrawalListData});
    }

    case ModuleEvents.FETCH_COMPANY_WITHDRAWAL: {
      let companyWithdrawalListData = state.get('companyWithdrawalListData');
      if (payload && !payload.error) {
        companyWithdrawalListData.items = payload.items;
        companyWithdrawalListData.nextLastKey = payload.lastKey;
      }

      return state.set('companyWithdrawalListData', {...companyWithdrawalListData});
    }

    case ModuleEvents.UPDATE_WITHDRAWAL_REQUEST: {
      let withdrawalListData = state.get('withdrawalListData');
      if (payload && !payload.error) {
        const index = _.findIndex(withdrawalListData.items, item => item?.requestId === payload?.requestId);
        if (index > -1) {
          withdrawalListData.items[index].adminMessage = payload?.adminMessage;
          withdrawalListData.items[index].receiptId = payload?.receiptId;
          withdrawalListData.items[index].status = payload?.status;
        }
      }

      return state.set('withdrawalListData', {...withdrawalListData});
    }

    case ModuleEvents.UPDATE_COMPANY_WITHDRAWAL: {
      let companyWithdrawalListData = state.get('companyWithdrawalListData');
      if (payload && !payload.error) {
        const index = _.findIndex(companyWithdrawalListData.items, item => item?.withdrawalId === payload?.withdrawalId);
        if (index > -1) {
          companyWithdrawalListData.items[index].adminMessage = payload?.adminMessage;
          companyWithdrawalListData.items[index].status = payload?.status;
        }
      }

      return state.set('companyWithdrawalListData', {...companyWithdrawalListData});
    }

    case ModuleEvents.FETCH_PAGINATE_WITHDRAWAL_REQUESTS: {
      let withdrawalListData = state.get('withdrawalListData');
      if (payload?.result && !payload?.result?.error) {
        const { type, result } = payload;

        console.log("++++++++++++++++++++payload, payload", payload)

        if (type === 'NEXT') {
          if (result.items.length > 0) {
            withdrawalListData.lastKeyList.push(withdrawalListData.nextLastKey);
          }
        } else {
          withdrawalListData.lastKeyList.splice(
            withdrawalListData.lastKeyList.length - 1,
            1,
          );
        }

        if (result?.items?.length > 0) {
          withdrawalListData.items = result.items;
        }

        withdrawalListData.nextLastKey = result.lastKey;
      }

      return state.set('withdrawalListData', {...withdrawalListData});
    }


    case ModuleEvents.FETCH_PAGINATE_COMPANY_WITHDRAWAL: {
      let companyWithdrawalListData = state.get('companyWithdrawalListData');
      if (payload?.result && !payload?.result?.error) {
        const { type, result } = payload;

        console.log("++++++++++++++++++++payload, payload", payload)

        if (type === 'NEXT') {
          if (result.items.length > 0) {
            companyWithdrawalListData.lastKeyList.push(companyWithdrawalListData.nextLastKey);
          }
        } else {
          companyWithdrawalListData.lastKeyList.splice(
            companyWithdrawalListData.lastKeyList.length - 1,
            1,
          );
        }

        if (result?.items?.length > 0) {
          companyWithdrawalListData.items = result.items;
        }

        companyWithdrawalListData.nextLastKey = result.lastKey;
      }

      return state.set('companyWithdrawalListData', {...companyWithdrawalListData});
    }

    default:
      return state;
  }
};

export default Reducer;
