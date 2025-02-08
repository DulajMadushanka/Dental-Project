import RiderRepository from '../../internals/repository/RiderRepository';
import UserRepository from "../../internals/repository/UserRepository";
import PaymentRepository from "../../internals/repository/PaymentRepository";

export const ModuleEvents = {
  FETCH_WITHDRAWAL_REQUESTS: "FETCH_WITHDRAWAL_REQUESTS",
  FETCH_PAGINATE_WITHDRAWAL_REQUESTS: 'FETCH_PAGINATE_WITHDRAWAL_REQUESTS',
  UPDATE_WITHDRAWAL_REQUEST: 'UPDATE_WITHDRAWAL_REQUEST',
  FETCH_COMPANY_WITHDRAWAL: 'FETCH_COMPANY_WITHDRAWAL',
  FETCH_PAGINATE_COMPANY_WITHDRAWAL: 'FETCH_PAGINATE_COMPANY_WITHDRAWAL',
  UPDATE_COMPANY_WITHDRAWAL: 'UPDATE_COMPANY_WITHDRAWAL'
};

const createAction =
  (type, action = () => {}, meta) =>
  (...args) => ({
    type,
    payload: action(...args),
    meta,
  });

const fetchWithdrawalRequests = createAction(
  ModuleEvents.FETCH_WITHDRAWAL_REQUESTS, async (param) => {
    const result = await PaymentRepository.fetchWithdrawalRequests(param);
    return result;
  }
);

const fetchCompanyWithdrawal = createAction(
  ModuleEvents.FETCH_COMPANY_WITHDRAWAL, async (param) => {
    const result = await PaymentRepository.fetchCompanyWithdrawal(param);
    return result;
  }
);

const updateWithdrawalRequest = createAction(
  ModuleEvents.UPDATE_WITHDRAWAL_REQUEST, async (param) => {
    const result = await PaymentRepository.updateWithdrawalRequest(param);
    return result;
  }
);

const updateCompanyWithdrawal = createAction(
  ModuleEvents.UPDATE_COMPANY_WITHDRAWAL, async (param) => {
    const result = await PaymentRepository.updateCompanyWithdrawal(param);
    if (result?.userId) {
      await PaymentRepository.updateCompanySummary(param);
    }
    return result;
  }
);

const fetchPaginateWithdrawalRequests = createAction(
  ModuleEvents.FETCH_PAGINATE_WITHDRAWAL_REQUESTS, async (param) => {
    const result = await PaymentRepository.fetchWithdrawalRequests(param);
    return {result, type: param.type};
  }
);

const fetchPaginateCompanyWithdrawal = createAction(
  ModuleEvents.FETCH_PAGINATE_COMPANY_WITHDRAWAL, async (param) => {
    const result = await PaymentRepository.fetchCompanyWithdrawal(param);
    return {result, type: param.type};
  }
);

const exportedFuction = {
  fetchWithdrawalRequests,
  fetchPaginateWithdrawalRequests,
  updateWithdrawalRequest,
  fetchCompanyWithdrawal,
  fetchPaginateCompanyWithdrawal,
  updateCompanyWithdrawal
};

export default exportedFuction;
