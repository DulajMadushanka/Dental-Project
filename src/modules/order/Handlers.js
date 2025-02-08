import {ModuleEvents} from "./Actions";
import {Actions} from "../../internals/app/Actions";
import {router} from "../../App";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export default {
  [ModuleEvents.UPDATE_WITHDRAWAL_REQUEST]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      return success("Withdrawal request successfully updated");
    } else {
      return warning("Withdrawal request updated fail!");
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
