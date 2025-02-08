import DashbaordRepository from "../../internals/repository/DashbaordRepository";

export const ModuleEvents = {
    GET_DASHBOARD_SUMMARY: "GET_DASHBOARD_SUMMARY",
    GET_DASHBOARD_LAST_WEEK_SUMMARY: "GET_DASHBOARD_LAST_WEEK_SUMMARY"
};

const createAction =
    (type, action = () => {
    }, meta) =>
        (...args) => ({
            type,
            payload: action(...args),
            meta,
        });

const getTodayPatientSummary = createAction(
    ModuleEvents.GET_DASHBOARD_SUMMARY,
    async (param) => {
        const result = await DashbaordRepository.getTodayPatientSummary(param)
        return result;
    }
);

const getLastWeekPatientSummary = createAction(
    ModuleEvents.GET_DASHBOARD_LAST_WEEK_SUMMARY,
    async (param) => {
        const result = await DashbaordRepository.getLastWeekPatientSummary(param)
        return result;
    }
);

const exportedFuction = {
    getTodayPatientSummary,
    getLastWeekPatientSummary
};

export default exportedFuction;
