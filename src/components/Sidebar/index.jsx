import { useState } from "react";
import { isEmpty } from "lodash";
import { router } from "../../App";
import sidebarRoutes from "../../routes";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/dental-sidebar-logo.jpg";
import IconUp from "../../assets/svgs/sidebar/icon-up.svg";
import IconDown from "../../assets/svgs/sidebar/icon-down.svg";
import IconLogout from "../../assets/svgs/sidebar/icon-logout.svg";
import _ from 'lodash';
import {connect} from "react-redux";
import {Actions} from "../../internals/app/Actions";
import {CreateProductView} from "../../modules/shop/views/CreateProductView";

const Sidebar = (props) => {
  const { onSelectDashBoard, logout, resetShopState } = props;
  const [openSubRoute, setOpenSubRoute] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");

  const renderItem = (route, isActive) => {
    const icon = route.icon;
    const selectedIcon = route.selectedIcon;

    return (
      <div className="flex flex-row justify-between items-center p-2 text-base font-normal text-gray-900 rounded-lg">
        <div className="flex flex-row justify-start items-center">
          <img alt="home" src={isActive ? selectedIcon : icon} />
          <span
            className={`${isActive ? "text-valhalla" : "text-hit-grey"} ml-3 text-sm`}
          >
            {route.name}
          </span>
        </div>
        {openSubRoute === route.name ? (
          <img
            alt="home"
            className="w-3 h-3"
            src={openSubRoute === route.name ? IconUp : IconDown}
          />
        ) : null}
      </div>
    );
  };

  const renderSubItem = (route: any) => {
    const isSelected = openSubRoute === route.name;
    const icon = route.icon;
    const selectedIcon = route.selectedIcon;

    return (
      <>
        <div
          onClick={() => {
            router.navigate(route.path);
            setSelectedRoute(route.name);
            setOpenSubRoute(route.name);
            resetShopState();
          }}
          className="flex flex-row cursor-pointer justify-between items-center p-2 text-base font-normal text-gray-900 rounded-lg"
        >
          <div className="flex flex-row justify-start items-center">
            <img alt="home" src={isSelected ? selectedIcon : icon} />
            <span
              className={`${
                isSelected ? "text-valhalla" : "text-hit-grey"
              } ml-3 text-sm`}
            >
              {route.name}
            </span>
          </div>
          <img
            alt="home"
            className="w-3 h-3"
            src={isSelected ? IconUp : IconDown}
          />
        </div>
        {isSelected && !isEmpty(route.subCategory)
          ? route.subCategory.map((sub: any) => {
              return (
                <NavLink
                  to={sub.path}
                  onClick={() => {
                    setSelectedRoute(sub.name);
                    onSelectDashBoard(sub.rtlName);
                  }}
                >
                  {({ isActive }: { isActive: boolean }) => {
                    return (
                      <div className="flex flex-row justify-between items-center p-2 text-base font-normal text-gray-900 rounded-lg">
                        <div className="ml-10 flex flex-row justify-start items-center text-sm">
                          <div
                            className={`${
                              isActive ? "bg-medium-slate-blue" : "bg-hit-grey"
                            } w-2 h-2 rounded`}
                          />
                          <span
                            className={`${
                              isActive ? "text-valhalla" : "text-hit-grey"
                            } ml-3`}
                          >
                            {sub.name}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                </NavLink>
              );
            })
          : null}
      </>
    );
  };

  const sideRoutesList = _.filter(sidebarRoutes, item => !item?.isHide);

  return (
    <aside className="w-full h-full" aria-label="Sidebar">
      <div className="h-full flex px-3 py-4 gap-10 overflow-y-auto flex-col justify-between">
        <div className="h-full flex gap-10 overflow-y-auto flex-col flex-start">
          <NavLink to="/" className="flex items-center">
            <img src={Logo} className="mr-3 h-[50px] w-[50px]" alt="Patient Management Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-dark">
              Madura Clinic
            </span>
          </NavLink>
          <ul className="space-y-4">
            {sideRoutesList.map((route: any) => {
              const isOpen = selectedRoute === route.name;
              const isActiveSub = !isEmpty(route.subCategory);

              return (
                <li>
                  {isActiveSub ? (
                    renderSubItem(route)
                  ) : (
                    <NavLink
                      to={route.path}
                      onClick={() => {
                        setOpenSubRoute("");
                        setSelectedRoute(route.name);
                        onSelectDashBoard(route.rtlName);
                        resetShopState(false);
                      }}
                    >
                      {({ isActive }: { isActive: boolean }) =>
                        renderItem(route, (isActive = isActive || isOpen))
                      }
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div
          onClick={() => logout()}
          className="w-full flex self-center items-center justify-center gap-4 cursor-pointer"
        >
          <img alt="logout" src={"https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/icon-logout.svg"} />
          <div>{"Logout"}</div>
        </div>
      </div>
    </aside>
  );
};

export default connect(
  state => ({

  }),
  ({
    resetShopState: Actions.shop.resetShopState,
    logout: Actions.login.logout,
  }),
)(Sidebar);
