import './App.css';
import Admin from "./layouts/Admin";
import { API } from "@aws-amplify/api";
import { Provider } from "react-redux";
import { Auth } from "@aws-amplify/auth";
import { Amplify } from "@aws-amplify/core";
import { Storage } from "@aws-amplify/storage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from "./internals/app/Store";
import DashboardView from "./modules/dashboard/views/DashboardView";
import React from "react";
import SignInView from "./modules/login/views/SignInView";
import PatientTreatmentView from "./modules/patientTreatment/views/PatientTreatmentView";
import CustomerView from "./modules/client/views/CustomerView";
// import BillView from "./modules/payment/views/BillView";
import RiderView from "./modules/rider/views/RiderView";
import AddShopProductView from "./modules/shop/views/AddShopProductView";
import AddShopProductFileView from "./modules/shop/views/AddShopProductFileView";
import WithdrawalRequestView from "./modules/withdrawal/views/WithdrawalRequestView";
import CompanyWithdrawalView from "./modules/withdrawal/views/CompanyWithdrawalView";
import OrderView from "./modules/order/views/OrderView";
import ProductView from "./modules/shop/views/ProductView";
import awsconfig from "./internals/config/aws_config";
import { Actions } from "./internals/app/Actions";
import PaymentView from "./modules/payment/views/PaymentView";
import BillView from "./modules/bill/views/BillView";
import PaymentSuccessView from "./modules/payment/views/SuccessView";
import PaymentFailedView from "./modules/payment/views/FailedView";
import { ToastContainer, toast } from 'react-toastify';

API.configure(awsconfig);
Auth.configure(awsconfig);
Amplify.configure(awsconfig);
Storage.configure(awsconfig);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Admin />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardView />,
      },
      {
        path: "/patients",
        element: <CustomerView />,
      },
      {
        path: "/patient-treatments",
        element: <PatientTreatmentView />,
      }
    ],
  },
  {
    path: "/signin",
    element: <SignInView />,
  }
]);

const App = () => {

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  );
}

export default App;

store.dispatch(Actions.login.authenticatedUser());
