import ShopRepository from "../../internals/repository/ShopRepository";

export const ModuleEvents = {
  FETCH_ALL_ORDERS: "FETCH_ALL_ORDERS",
  FETCH_PAGINATE_ALL_ORDERS: 'FETCH_PAGINATE_ALL_ORDERS'
};

const createAction =
  (type, action = () => {}, meta) =>
  (...args) => ({
    type,
    payload: action(...args),
    meta,
  });

const fetchAllOrders = createAction(
  ModuleEvents.FETCH_ALL_ORDERS,
  async (param) => {
    const result = await ShopRepository.fetchAllOrders(param);
    return result;
  }
);

const fetchPaginateAllOrders = createAction(
  ModuleEvents.FETCH_PAGINATE_ALL_ORDERS, async (param) => {
    const result = await ShopRepository.fetchAllOrders(param);
    return {result, type: param.type};
  }
);

const exportedFuction = {
  fetchAllOrders,
  fetchPaginateAllOrders
};

export default exportedFuction;
