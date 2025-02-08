import React, {useEffect, useState} from 'react';
import SearchBox from '../../../components/SearchBox';
import InformationIcon from '../../../assets/svgs/informationIcon.svg';
import EditIcon from '../../../assets/svgs/editIcon.svg';
import DeleteIcon from '../../../assets/svgs/deleteIcon.svg';
import Button from '@material-ui/core/Button/index';
import _ from 'lodash';
import {clsx} from "clsx";
import Drawer from '@material-ui/core/Drawer/index';
import Table from '@material-ui/core/Table/index';
import TableBody from '@material-ui/core/TableBody/index';
import TableCell from '@material-ui/core/TableCell/index';
import TableContainer from '@material-ui/core/TableContainer/index';
import TableHead from '@material-ui/core/TableHead/index';
import TablePagination from '@material-ui/core/TablePagination/index';
import TableRow from '@material-ui/core/TableRow/index';
import {Actions} from "../../../internals/app/Actions";
import {makeStyles} from "@material-ui/core/index";
import {connect} from "react-redux";
import {Col, Row} from 'react-grid-system';
import '../../../components/Transaction/transaction-component.css';
import AddRiderView from "./EditWithdrawalRequestView";
import BackWhiteIcon from "../../../assets/svgs/back-white-icon.svg";
import BackIcon from "../../../assets/svgs/back-icon.svg";
import NextWhiteIcon from "../../../assets/svgs/next-white-icon.svg";
import NextIcon from "../../../assets/svgs/next-icon.svg";

const useStyles = makeStyles({
  list: {width: 467},
  fullList: {width: 'auto'},
});

const columns = [
  {
    id: 'riderName',
    label: 'RIDER NAME',
    minWidth: '170px',
  },
  {
    id: 'email',
    label: 'EMAIL',
    minWidth: '165px',
  },
  {
    id: 'phoneNumber',
    label: 'PHONE NUMBER',
    minWidth: '122px',
  },
  {
    id: 'amount',
    label: 'AMOUNT',
    minWidth: '122px',
  },
  {
    id: 'message',
    label: 'MESSAGE',
    minWidth: '222px',
  },
  {
    id: 'adminMessage',
    label: 'ADMIN MESSAGE',
    minWidth: '222px',
  },
  {
    id: 'status',
    label: 'STATUS',
    minWidth: '122px',
  },
  {
    id: 'actions',
    label: 'ACTIONS',
    minWidth: '20px',
  },
];

const useTableStyles = makeStyles({
  root: {
    width: '100%',
    marginTop: '24px',
  },
  container: {
    // maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px'
  },
  cell: {
    backgroundColor: '#fff',
    fontFamily: 'Inter, sans-serif',
    borderBottom: '1px solid #F0F3F7',
    padding: '8px',
    paddingLeft: '24px',
    paddingRight: '24px'
  },
  stickyHeader: {
    color: '#859293',
    fontFamily: 'Inter, sans-serif',
    borderBottom: '1px solid #F0F3F7',
    backgroundColor: '#F8F9FB',
    paddingLeft: '24px',
    paddingRight: '24px'
  },
});


const WithdrawalRequestView = (props) => {
  const {currentUser, riderList, withdrawalListData, openAlertBox, alertStatus, fetchPaginateWithdrawalRequests} = props;

  const [clients, setClients] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const classes = useStyles();
  const perPageCount = 20;
  const [requestRowDetails, setRequestRowDetails] = useState([]);
  const tableClasses = useTableStyles();
  const [selectedModal, setSelectedModal] = useState(null);
  const [state, setState] = React.useState({
    right: false,
  });

  useEffect(() => {
    if (withdrawalListData?.items?.length > 0) {
      const data = withdrawalListData?.items.map((request) => {
        return {
          id: request?.requestId,
          riderName: request?.user?.name,
          email: request?.user?.email,
          phoneNumber: request?.user?.phoneNumber,
          amount: request.withdrawalAmount?.toFixed(2),
          message: request?.message,
          adminMessage: request?.adminMessage,
          status: request?.status
        };
      });
      setRequestRowDetails([...data]);
    } else {
      setRequestRowDetails([]);
    }
  }, [withdrawalListData]);


  const toggleDrawer = (anchor, open, status, rider) => (event) => {
    setSelectedModal(status);
    setSelectedWithdrawal(rider);
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({...state, [anchor]: open});
  };

  console.log("++++++++++++++++++++++, selectedWithdrawal", selectedWithdrawal)

  const renderAddRider = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <AddRiderView
        status={selectedModal}
        withdrawal={selectedWithdrawal}
        onCloseDrawer={toggleDrawer('right', false, null)}
      />
    </div>
  );

  const renderAppointmentDetails = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      {/*<AppointmentDetailsView*/}
      {/*  status={selectedModal}*/}
      {/*  appointment={selectedClient}*/}
      {/*  onCloseDrawer={toggleDrawer('right', false, null)}*/}
      {/*/>*/}
    </div>
  );

  const onPaginateRequests = (type) => {
    const status = type;
    const preLastKey = withdrawalListData.lastKeyList[withdrawalListData.lastKeyList.length - 2];
    const nextLastKey = _.get(withdrawalListData, 'nextLastKey', null);
    const lastKey = _.isEmpty(preLastKey) ? null : preLastKey;

    if (!_.isEmpty(nextLastKey) && status === 'NEXT') {
      fetchPaginateWithdrawalRequests({userId: currentUser.id, limit: perPageCount, lastKey: nextLastKey, type})
    } else if (status === 'PREV') {
      fetchPaginateWithdrawalRequests({userId: currentUser.id, limit: perPageCount, lastKey, type})
    }
  };

  console.log("++++++++++++++++, withdrawalListData", withdrawalListData)
  const isHasPrevItems = withdrawalListData?.lastKeyList?.length > 0;
  const isHasNextItems = !_.isEmpty(withdrawalListData?.nextLastKey);

  return (
    <div className="client-wrapper">
      {/*<SuccessAlert*/}
      {/*  alertStatus={alertStatus}*/}
      {/*  onCloseAlert={(status) => openAlertBox(status, false, alertStatus.successStatus)}*/}
      {/*/>*/}
      <div>
        {
          (riderList?.length > 0 ||
            (searchText && riderList.length === 0 && isSearch) ||
            (searchText && riderList.length === 0 && !isSearch) ||
            (!searchText && isSearch)) ?
            <>
              {
                <div className={tableClasses.root}>
                  <TableContainer className={tableClasses.container} style={{ height: 'calc(100vh - 235px)'}}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              className={tableClasses.stickyHeader}
                              key={column.id}
                              align={column.align}
                              style={{minWidth: column.minWidth}}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {requestRowDetails.map((row) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                const requestData = _.find(withdrawalListData?.items, (request) => {
                                  return request.requestId === row.id;
                                });

                                return (
                                  <>
                                    {
                                      column.id === 'actions' ?
                                        <TableCell
                                          className={tableClasses.cell}
                                          key={column.id} align={column.align}>
                                          <div className="client-table-action-btn">
                                            <div onClick={toggleDrawer('right', true, "EDIT_RIDER", requestData)} className="client-table-action"><img src={"https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/editIcon.svg"}/></div>
                                            {/*<div onClick={() => {setSelectedClient(client);setIsDeleteModal(!isDeleteModal)}} className="client-table-action"><img src={DeleteIcon}/></div>*/}
                                            {/*<div onClick={() => {}} className="client-table-action"><img src={InformationIcon}/></div>*/}
                                          </div>
                                        </TableCell>
                                        :
                                        <TableCell
                                          className={tableClasses.cell}
                                          key={column.id} align={column.align}>
                                          {/*{*/}
                                          {/*  column.id === 'clientName' ?*/}
                                          {/*    <S3Image url={currentUser?.image} defaultImage={SidebarUserDefaultImage} className="client-user-image"/>*/}
                                          {/*    :*/}
                                          {/*    column.id === 'appointments' ?*/}
                                          {/*      <div onClick={row.appointments ? toggleDrawer('right', true, "APPOINTMENT_DETAILS", appointment) : ()=>{}} className={row.appointments ? "client-schedule-value" : 'client-un-schedule-value'}>{row.appointments ? 'Scheduled' : 'Unscheduled'}</div>*/}
                                          {/*      : null*/}
                                          {/*}*/}
                                          {value}
                                        </TableCell>
                                    }
                                  </>

                                );
                              })}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="flex flex-row items-center justify-end mt-5 mb-5">
                    <div
                      className={`w-[32px] h-[32px] rounded-[50px] justify-center items-center flex cursor-pointer ${isHasPrevItems ? "bg-[#EE572E]" : "bg-[#EEECEC]"}`}
                      onClick={() => {
                        if (isHasPrevItems) {
                          onPaginateRequests("PREV")
                        }
                      }}>
                      <img src={isHasPrevItems ? "https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/back-white-icon.svg" : "https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/back-icon.svg"}/>
                    </div>
                    <div className="ml-5 mr-5 font-bold text-[18px]">
                      {withdrawalListData.lastKeyList?.length + 1}
                    </div>
                    <div
                      className={`w-[32px] h-[32px] rounded-[50px] justify-center items-center flex cursor-pointer ${isHasNextItems ? "bg-[#EE572E]" : "bg-[#EEECEC]"}`}
                      onClick={() => {
                        if (isHasNextItems) {
                          onPaginateRequests("NEXT")
                        }
                      }}>
                      <img src={isHasNextItems ? "https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/next-white-icon.svg" : "https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/next-icon.svg"}/>
                    </div>
                  </div>
                </div>
              }
            </>
            :
            <div className={'client-empty-wrapper'}>
              <div className="client-empty-text">Oops! Don’t have any riders yet.</div>
            </div>
        }
        {
          searchText && clients.length === 0 ?
            <div className={'client-empty-wrapper'}>
              <div className="client-empty-text">No results found</div>
              <div className="client-empty-title-text">We can’t find any matching data record for your search
              </div>
            </div>
            : null
        }
        <div>
          <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false, null, null)}>
            {
              (selectedModal === "ADD_RIDER" || selectedModal === "EDIT_RIDER") ?
                renderAddRider("right")
                : selectedModal === "APPOINTMENT_DETAILS" ?
                renderAppointmentDetails("right")
                : <div/>

            }
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default connect(state =>
    ({
      riderList: state.rider.get('riderList'),
      currentUser: state.login.get('currentUser'),
      alertStatus: state.common.get('alertStatus'),
      // selectedShop: state.shop.get('selectedShop'),
      withdrawalListData: state.withdrawal.get('withdrawalListData'),
    }),
  ({
    openAlertBox: Actions.common.openAlertBox,
    fetchPaginateWithdrawalRequests: Actions.withdrawal.fetchPaginateWithdrawalRequests,
  }),
)(WithdrawalRequestView);

