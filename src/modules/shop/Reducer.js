import { Map } from "immutable";
import {ModuleEvents} from "./Actions";

const initialState = Map({
  shopsList: [],
  selectedProductShop: [],
  selectedUserShop: {},
  selectedUserShopProducts: []
});

export const Reducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ModuleEvents.FETCH_ALL_SHOPS: {
      if (payload && !payload.error) {
        return state.set("shopsList", [...payload]);
      }
      return state;
    }

    case ModuleEvents.SEARCH_SHOPS: {
      if (payload && !payload.error) {
        return state.set("shopsList", [...payload]);
      }
      return state;
    }

    case ModuleEvents.CREATE_SHOP_PRODUCT: {
      if (payload && !payload.error) {
        return state.set("selectedProductShop", []);
      }
      return state;
    }

    case ModuleEvents.SELECT_USER_SHOP: {
      const { shops, productList } = payload;
      if (payload && !payload.error) {
        return state.set("selectedUserShopProducts", [...productList]).set('selectedUserShop', {...shops});
      }
      return state;
    }

    case ModuleEvents.FETCH_SHOP_PRODUCTS: {
      if (payload && !payload.error) {
        return state.set("selectedUserShopProducts", [...payload]);
      }
      return state;
    }

    case ModuleEvents.RESET_SHOP_STATE: {
      return state.set("selectedProductShop", []).set('selectedUserShopProducts', []).set('selectedUserShop', {});
    }

    case ModuleEvents.CREATE_SHOP_FILE_PRODUCT: {
      if (payload && !payload.error) {
        return state.set("selectedProductShop", []);
      }
      return state;
    }

    case ModuleEvents.SELECT_PRODUCT_SHOP: {
      return state.set("selectedProductShop", [...payload]);
    }

    default:
      return state;
  }
};

export default Reducer;
