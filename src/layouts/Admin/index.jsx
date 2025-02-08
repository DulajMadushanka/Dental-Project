import "../Styles.css";
import { connect } from "react-redux";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar";
import * as React from "react";

const Admin = (props: any) => {

  return (
    <div className="wrapper">
      <div className="sidebarWrapper">
        <Sidebar logout={() => {}} onSelectDashBoard={() => {}} />
      </div>
      <div className="componentWrapper">
        <div className="navigationWrapper">
          <NavigationBar />
        </div>
        <div className="detailsWrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default connect((state: any) => ({}), {
  // logout: Actions.login.logout,
})(Admin);
