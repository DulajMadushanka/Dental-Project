import AuthRepository from '../../internals/repository/AuthRepository';
import UserRepository from '../../internals/repository/UserRepository';

export const ModuleEvents = {
  LOGIN: "LOGIN",
  AUTHENTICATED_USER: "AUTHENTICATED_USER",
  GET_CURRENT_USER: "GET_CURRENT_USER",
  LOG_OUT: "LOG_OUT"
};

const createAction =
  (type, action = () => {}, meta) =>
  (...args) => ({
    type,
    payload: action(...args),
    meta,
  });

const login = createAction(
  ModuleEvents.LOGIN,
  async (username, password) => {
    const user = await AuthRepository.login(username, password);
    return user;
  },
  { loading: true }
);

const getCurrentUser = createAction(
  ModuleEvents.GET_CURRENT_USER,
  async (userId) => {
    const result = await UserRepository.getUserForId(userId);
    return result;
  }
);

const authenticatedUser = createAction(
  ModuleEvents.AUTHENTICATED_USER,
  async () => {
    const user = await AuthRepository.authenticatedUser();
    return user;
  }
);

const logout = createAction(
  ModuleEvents.LOG_OUT,
  async () => await AuthRepository.logout()
);

const exportedFuction = {
  login,
  authenticatedUser,
  getCurrentUser,
  logout
};

export default exportedFuction;
