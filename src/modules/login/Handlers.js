import Swal from "sweetalert2";
import { router } from "../../App";
import { ModuleEvents } from "./Actions";
import { LOGIN_ERROR } from "./Constants";
import { delay, get, isNull } from "lodash";
import { Actions } from "../../internals/app/Actions";
import withReactContent from "sweetalert2-react-content";
import UserRepository from "../../internals/repository/UserRepository";
import moment from 'moment-timezone';

const todayDate = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
const weekStartDate = moment().tz("Asia/Colombo").startOf('isoWeek').format("YYYY-MM-DD");

export default {
  [ModuleEvents.LOGIN]: async ({ dispatch, payload, appState }) => {
    const userId = get(payload, "signInUserSession.idToken.payload[custom:id]");
    if (payload && !payload.error && userId) {
      const result = await UserRepository.getUserForId(userId);
      if (result.userType === "ADMIN") {
        dispatch(Actions.login.getCurrentUser(userId));
      } else {
        router.navigate("/signin");
        return warning("Enter valid username or password");
      }

    } else if (
      get(payload, "error.code") === "UserNotFoundException" ||
      get(payload, "error.code") === "NotAuthorizedException"
    ) {
      return warning(payload.error.message);
    } else if (get(payload, "error.code") === LOGIN_ERROR.USER_NOT_CONFIRMED) {
      return warning(payload.error.message);
    } else if (
      get(payload, "error.code") === "PasswordResetRequiredException"
    ) {
      return warning("Password reset required for the user");
    } else {
      return warning("Catched error when user login!");
    }
  },

  [ModuleEvents.AUTHENTICATED_USER]: async ({ dispatch, payload, appState }) => {
    if (window.location?.pathname === "/customer-bill") {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('orderId');
      router.navigate(`/customer-bill?orderId=${orderId}`);
    } else if (window.location?.pathname === "/payment") {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('orderId');
      router.navigate(`/payment?orderId=${orderId}`);
    } else if (window.location?.pathname === "/success") {
      router.navigate(`/success`);
    } else if (window.location?.pathname === "/failed") {
      router.navigate(`/failed`);
    } else {
      if (payload && !payload.error) {
        const userId = get(
          payload,
          "signInUserSession.idToken.payload.[custom:id]",
          null
        );
        if (userId) {
          const result = await UserRepository.getUserForId(userId);
          console.log("+++++++++++++++++++, result", result)
          if (result.userType === "ADMIN") {
            dispatch(Actions.login.getCurrentUser(userId));
          } else {
            router.navigate("/signin");
          }
        } else {
          router.navigate("/signin");
        }
      } else {
        router.navigate("/signin");
      }
    }
  },
  [ModuleEvents.GET_CURRENT_USER]: ({ dispatch, payload, appState }) => {
    console.log("++++++++++++++++++++, payload", payload)
    if (payload && !payload.error) {
      dispatch(Actions.dashboard.getTodayPatientSummary({date: todayDate, weekStartDate}));
      dispatch(Actions.dashboard.getLastWeekPatientSummary({weekStartDate}));
      dispatch(Actions.rider.fetchAllRiders());
      dispatch(Actions.client.fetchAllPatients());
      dispatch(Actions.patientTreatment.fetchAllPatientTreatments());
      dispatch(Actions.withdrawal.fetchWithdrawalRequests({userId: payload?.id, limit: 20, lastKey: null}));
      dispatch(Actions.withdrawal.fetchCompanyWithdrawal({userId: payload?.id, limit: 20, lastKey: null}));
      dispatch(Actions.order.fetchAllOrders({limit: 20, lastKey: null}));
      router.navigate("/dashboard");
    } else {
      router.navigate("/signin");
    }
  },

  [ModuleEvents.LOG_OUT]: ({ dispatch, payload, appState }) => {
    router.navigate("/signin");
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
