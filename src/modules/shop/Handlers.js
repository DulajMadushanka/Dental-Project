import Swal from "sweetalert2";
import { ModuleEvents } from "./Actions";
import withReactContent from "sweetalert2-react-content";
import {router} from "../../App";
import {Actions} from "../../internals/app/Actions";

export default {
  [ModuleEvents.OPEN_ALERT_MESSAGE]: ({ dispatch, payload, appState }) => {
    return warning("Please select at least one shop before add a product.");
  },
  [ModuleEvents.SELECT_FILE_SHOP_PRODUCT]: ({ dispatch, payload, appState }) => {
    router.navigate('/shop-product-file')
  },
  [ModuleEvents.CREATE_SHOP_PRODUCT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload?.error) {
      dispatch(Actions.shop.fetchAllShops());
      router.navigate('/shop');
      return success("Product create successful");
    } else {
      return success("Product create failed");
    }
  },
  [ModuleEvents.CREATE_SHOP_FILE_PRODUCT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload?.error) {
      dispatch(Actions.shop.fetchAllShops());
      router.navigate('/shop')
      return success("Product create successful");
    } else {
      return success("Product create failed");
    }
  },
  [ModuleEvents.DELETE_PRODUCT]: ({ dispatch, payload, appState }) => {
    const selectedUserShop = appState.shop.get('selectedUserShop');
    if (payload && !payload?.error) {
      dispatch(Actions.shop.fetchShopProducts(selectedUserShop.placeId));
      return success("Product delete successful");
    } else {
      return success("Product delete failed");
    }
  },
  [ModuleEvents.UPDATE_PRODUCT]: ({ dispatch, payload, appState }) => {
    const selectedUserShop = appState.shop.get('selectedUserShop');
    if (payload && !payload?.error) {
      dispatch(Actions.shop.fetchShopProducts(selectedUserShop.placeId));
      return success("Product update successful");
    } else {
      return success("Product update failed");
    }
  },
  [ModuleEvents.CREATE_PRODUCT]: ({ dispatch, payload, appState }) => {
    const selectedUserShop = appState.shop.get('selectedUserShop');
    if (payload && !payload?.error) {
      dispatch(Actions.shop.fetchShopProducts(selectedUserShop.placeId));
      return success("Product create successful");
    } else {
      return success("Product create failed");
    }
  },
  [ModuleEvents.RESET_SHOP_STATE]: ({ dispatch, payload, appState }) => {
    const { isNavigate } = payload;
    if (isNavigate) {
      dispatch(Actions.shop.fetchAllShops());
      router.navigate('/shop');
    }
  },
  [ModuleEvents.SELECT_USER_SHOP]: ({ dispatch, payload, appState }) => {
    router.navigate('/product');
  },
};

const warning = (alert) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    icon: "error",
    text: alert,
    title: "Oops...",
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonColor: "#FF3333",
  });
};

const success = (alert) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    icon: "success",
    text: alert,
    title: "Success",
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonColor: "#6D71F9",
  });
};
