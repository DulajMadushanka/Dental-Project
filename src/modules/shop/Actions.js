import CustomerRepository from "../../internals/repository/CustomerRepository";
import ShopRepository from "../../internals/repository/ShopRepository";

export const ModuleEvents = {
  FETCH_ALL_SHOPS: "FETCH_ALL_SHOPS",
  SELECT_PRODUCT_SHOP: 'SELECT_PRODUCT_SHOP',
  SEARCH_SHOPS: 'SEARCH_SHOPS',
  OPEN_ALERT_MESSAGE: 'OPEN_ALERT_MESSAGE',
  CREATE_SHOP_PRODUCT: 'CREATE_SHOP_PRODUCT',
  SELECT_FILE_SHOP_PRODUCT: 'SELECT_FILE_SHOP_PRODUCT',
  CREATE_SHOP_FILE_PRODUCT: 'CREATE_SHOP_FILE_PRODUCT',
  RESET_SHOP_STATE: 'RESET_SHOP_STATE',
  SELECT_USER_SHOP: 'SELECT_USER_SHOP',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  FETCH_SHOP_PRODUCTS: 'FETCH_SHOP_PRODUCTS',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  CREATE_PRODUCT: 'CREATE_PRODUCT'
};

const createAction =
  (type, action = () => {}, meta) =>
    (...args) => ({
      type,
      payload: action(...args),
      meta,
    });

const fetchAllShops = createAction(
  ModuleEvents.FETCH_ALL_SHOPS,
  async () => {
    const result = await ShopRepository.fetchAllShops();
    return result;
  }
);

const searchShops = createAction(
  ModuleEvents.SEARCH_SHOPS,
  async (param) => {
    const result = await ShopRepository.searchShops(param);
    return result;
  }
);

const createShopProduct = createAction(
  ModuleEvents.CREATE_SHOP_PRODUCT,
  async (param) => {
    const result = await ShopRepository.createShopProduct(param);
    return result;
  }
);

const selectProductShop = createAction(
  ModuleEvents.SELECT_PRODUCT_SHOP,
  async (shops) => {
    return shops;
  }
);

const openAlertMessage = createAction(
  ModuleEvents.OPEN_ALERT_MESSAGE,
  async () => {
    return true;
  }
);

const selectFileShopProducts = createAction(
  ModuleEvents.SELECT_FILE_SHOP_PRODUCT,
  async (list) => {
    return list;
  }
);

const createShopFileProduct = createAction(
  ModuleEvents.CREATE_SHOP_FILE_PRODUCT,
  async (param) => {
    const result = await ShopRepository.createShopFileProduct(param);
    return result;
  }
);

const selectUserShop = createAction(
  ModuleEvents.SELECT_USER_SHOP, async (shops) => {
    const productList = await ShopRepository.fetchShopProducts(shops.placeId);
    return {shops, productList};
  }
);

const fetchShopProducts = createAction(
  ModuleEvents.FETCH_SHOP_PRODUCTS, async (shopId) => {
    const productList = await ShopRepository.fetchShopProducts(shopId);
    return productList
  }
);

const deleteUserProduct = createAction(
  ModuleEvents.DELETE_PRODUCT, async (productId) => {
    const productResult = await ShopRepository.deleteUserProduct({productId});
    return productResult;
  }
);

const updateUserProduct = createAction(
  ModuleEvents.UPDATE_PRODUCT, async (param) => {
    const productResult = await ShopRepository.updateUserProduct(param);
    return productResult;
  }
);

const createUserProduct = createAction(
  ModuleEvents.CREATE_PRODUCT, async (param) => {
    const productResult = await ShopRepository.createUserProduct(param);
    return productResult;
  }
);

const resetShopState = createAction(
  ModuleEvents.RESET_SHOP_STATE,
  async (isNavigate = true) => {
    return {isNavigate};
  }
);




const exportedFuction = {
  fetchAllShops,
  selectProductShop,
  searchShops,
  openAlertMessage,
  createShopProduct,
  selectFileShopProducts,
  createShopFileProduct,
  resetShopState,
  selectUserShop,
  deleteUserProduct,
  fetchShopProducts,
  updateUserProduct,
  createUserProduct
};

export default exportedFuction;
