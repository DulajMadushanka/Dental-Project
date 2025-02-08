import Dashboard from "../src/assets/svgs/sidebar/dashboard-gray.svg";
import DashboardSelected from "../src/assets/svgs/sidebar/dashboard-select.svg";
import Products from "../src/assets/svgs/sidebar/product-gray.svg";
import ProductsSelected from "../src/assets/svgs/sidebar/product-select.svg";
import Customers from "../src/assets/svgs/sidebar/clients-gray.svg";
import CustomersSelected from "../src/assets/svgs/sidebar/clients-select.svg";
import DashboardView from "./modules/dashboard/views/DashboardView";
import ShopView from "./modules/shop/views/ShopView";
import RiderView from "./modules/rider/views/RiderView";
import CustomerView from "./modules/client/views/CustomerView";
import PatientTreatmentView from "./modules/patientTreatment/views/PatientTreatmentView";
import AddShopProductFileView from "./modules/shop/views/AddShopProductFileView";
import WithdrawalRequestView from "./modules/withdrawal/views/WithdrawalRequestView";
import CompanyWithdrawalView from "./modules/withdrawal/views/CompanyWithdrawalView";
import ProductView from "./modules/shop/views/ProductView";
import OrderView from "./modules/order/views/OrderView";
import PaymentView from "./modules/payment/views/PaymentView";
import BillView from "./modules/bill/views/BillView";

const sidebarRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    rtlName: 'Overview',
    icon: "https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/dashboard-gray.svg",
    selectedIcon: "https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/dashboard-select.svg",
    component: DashboardView,
    layout: '/admin',
  },
  {
    path: '/patients',
    name: 'Patients',
    rtlName: 'Patients',
    icon: Customers,
    layout: '/admin',
    selectedIcon: CustomersSelected,
    component: CustomerView,
  },
  {
    path: '/patient-treatments',
    name: 'Patient Treatments',
    rtlName: 'Patient Treatments',
    icon: Products,
    layout: '/admin',
    selectedIcon: ProductsSelected,
    component: PatientTreatmentView,
  },
];
export default sidebarRoutes;
