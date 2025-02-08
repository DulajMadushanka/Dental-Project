import RiderRepository from '../../internals/repository/RiderRepository';
import UserRepository from "../../internals/repository/UserRepository";

export const ModuleEvents = {
  FETCH_ALL_RIDERS: "FETCH_ALL_RIDERS",
  UPDATE_RIDER: 'UPDATE_RIDER'
};

const createAction =
  (type, action = () => {}, meta) =>
  (...args) => ({
    type,
    payload: action(...args),
    meta,
  });

const fetchAllRiders = createAction(
  ModuleEvents.FETCH_ALL_RIDERS,
  async () => {
    const result = await RiderRepository.fetchAllRiders();
    return result;
  }
);

const updateRider = createAction(
  ModuleEvents.UPDATE_RIDER,
  async (param) => {
    const result = await UserRepository.updateUser(param);
    return result;
  }
);

const exportedFuction = {
  fetchAllRiders,
  updateRider
};

export default exportedFuction;
