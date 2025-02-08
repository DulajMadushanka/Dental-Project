import {ModuleEvents} from "./Actions";
import {Actions} from "../../internals/app/Actions";
import {router} from "../../App";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default {
  [ModuleEvents.UPDATE_RIDER]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.rider.fetchAllRiders());
      dispatch(Actions.rider.changePatientCreateLoading(false));
      return success("Rider successfully updated");
    } else {
      dispatch(Actions.rider.changePatientCreateLoading(false));
      return warning("Rider updated fail!");
    }
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
