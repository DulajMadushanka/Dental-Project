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
import BackWhiteIcon from '../../../assets/svgs/back-white-icon.svg';
import BackIcon from '../../../assets/svgs/back-icon.svg';
import NextWhiteIcon from '../../../assets/svgs/next-white-icon.svg';
import NextIcon from '../../../assets/svgs/next-icon.svg';
import Modal from 'react-modal';
import moment from 'moment';
import {generateImage} from "../../../internals/manager/ImageManager";

const useStyles = makeStyles({
  list: {width: 467},
  fullList: {width: 'auto'},
});

const columns = [
  {
    id: 'shopName',
    label: 'SHOP NAME',
    minWidth: '222px',
  },
  {
    id: 'riderName',
    label: 'RIDER NAME',
    minWidth: '170px',
  },
  {
    id: 'customerName',
    label: 'CUSTOMER NAME',
    minWidth: '165px',
  },
  {
    id: 'totalPrice',
    label: 'TOTAL PRICE',
    minWidth: '122px',
  },
  {
    id: 'paymentType',
    label: 'PAYMENT TYPE',
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


const OrderView = (props) => {
  const {currentUser, riderList, orderListData, openAlertBox, alertStatus, fetchPaginateAllOrders} = props;

  const [clients, setClients] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (orderListData?.items?.length > 0) {
      const data = orderListData?.items.map((request) => {
        return {
          id: request?.orderId,
          riderName: request?.rider?.name,
          customerName: request?.user?.name,
          totalPrice: parseFloat(request?.totalPrice)?.toFixed(2),
          paymentType: paymentTypeList[request?.paymentType],
          shopName: request?.shopName,
          status: orderStatusList[request?.orderStatus]
        };
      });
      setRequestRowDetails([...data]);
    } else {
      setRequestRowDetails([]);
    }
  }, [orderListData]);


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

  const onPaginateOrders = (type) => {
    const status = type;
    const preLastKey = orderListData.lastKeyList[orderListData.lastKeyList.length - 2];
    const nextLastKey = _.get(orderListData, 'nextLastKey', null);
    const lastKey = _.isEmpty(preLastKey) ? null : preLastKey;

    if (!_.isEmpty(nextLastKey) && status === 'NEXT') {
      fetchPaginateAllOrders({userId: currentUser.id, limit: perPageCount, lastKey: nextLastKey, type})
    } else if (status === 'PREV') {
      fetchPaginateAllOrders({userId: currentUser.id, limit: perPageCount, lastKey, type})
    }
  };

  const isHasPrevItems = orderListData?.lastKeyList?.length > 0;
  const isHasNextItems = !_.isEmpty(orderListData?.nextLastKey);
  const isLong = selectedOrder?.orderStatus === "ORDER_COMPLETED" || selectedOrder?.orderStatus === "PAY_FULL_PRICE" || selectedOrder?.orderStatus === "BILL_UPLOAD";

  console.log("++++++++++++++++, selectedOrder", selectedOrder)

  return (
    <div className="client-wrapper">
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
                                const orderData = _.find(orderListData?.items, (order) => {
                                  return order.orderId === row.id;
                                });

                                return (
                                  <>
                                    {
                                      column.id === 'actions' ?
                                        <TableCell
                                          className={tableClasses.cell}
                                          key={column.id} align={column.align}>
                                          <div className="client-table-action-btn">
                                            <div onClick={() => {
                                              setSelectedOrder(orderData);
                                              setIsOpen(true);
                                            }} className="client-table-action"><img src={InformationIcon}/></div>
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
                          onPaginateOrders("PREV")
                        }
                      }}>
                      <img src={isHasPrevItems ? "https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/back-white-icon.svg" : "https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/back-icon.svg"}/>
                    </div>
                    <div className="ml-5 mr-5 font-bold text-[18px]">
                      {orderListData.lastKeyList?.length + 1}
                    </div>
                    <div
                      className={`w-[32px] h-[32px] rounded-[50px] justify-center items-center flex cursor-pointer ${isHasNextItems ? "bg-[#EE572E]" : "bg-[#EEECEC]"}`}
                      onClick={() => {
                        if (isHasNextItems) {
                          onPaginateOrders("NEXT")
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
      <Modal
        isOpen={isOpen}
        style={{
          overlay: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            position: 'fixed',
            justifyContent: 'center',
            zIndex: 1000
            // backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            height: 'auto',
            padding: 0,
            overflow: 'auto',
            maxWidth: '674px',
            maxHeight: isLong ? '769px' : '450px',
            background: '#fff',
            borderRadius: '8px',
            position: 'absolute',
            top: 'calc(50vh - 23rem)',
            left: 'calc(50vw - 370px)',
            WebkitOverflowScrolling: 'touch',
            boxShadow: '0 4px 10px 1px rgb(0 0 0 / 0.8)',
          },
        }}
        contentLabel="Category Modal"
        onRequestClose={() => setIsOpen(false)}
      >
        <div className="flex flex-col w-full h-full px-6 selection:overflow-hidden shadow rounded-lg bg-[#FFFFFF] pb-[20px]">
          <div className="mt-[20px]">
            <div className="text-[18px] text-center font-bold">
              {selectedOrder?.shopName}
            </div>
            <div className="text-[15px] font-Medium mt-[20px]">
              Order Date: {selectedOrder?.createdTime ? moment(selectedOrder?.createdTime).format("YYYY-MM-DD") : ""}
            </div>
            <div className="text[12px] mt-[10px]">
              Rider Name: {selectedOrder?.rider?.name}
            </div>
            <div className="text[12px] mt-[5px]">
              Customer Name: {selectedOrder?.user?.name}
            </div>
            <div className="text[12px] mt-[5px]">
              Payment Method: {paymentTypeList[selectedOrder?.paymentType]}
            </div>
            <div className="text[12px] mt-[5px]">
              Order Status: {orderStatusList[selectedOrder?.orderStatus]}
            </div>
            <div className="w-[200px] mt-[20px]">
              <div className="flex flex-row items-center justify-between">
                <div className="text-[18px] text-center font-bold">
                  Item
                </div>
                <div className="text-[18px] text-center font-bold">
                  QTY
                </div>
              </div>
              {
                selectedOrder?.orderDetails?.map((item) => {
                  return (
                    <div className="flex flex-row items-center justify-between">
                      <div>
                        {item?.itemName}
                      </div>
                      <div>
                        {item?.quantity} {item?.quantityType}
                      </div>
                    </div>
                  )
                })
              }
              <div className="flex flex-row items-center justify-between mt-[10px]">
                <div className="text-[14px] text-center font-medium">
                  Total Price
                </div>
                <div className="text-[14px] text-center font-medium">
                  {selectedOrder?.totalPrice}
                </div>
              </div>
            </div>
            {
              selectedOrder?.billImage ?
                <div style={{paddingBottom: 40}}>
                  <div className="text-[18px] font-bold mt-[20px]">
                    Receipt
                  </div>
                  <div style={{width: '100%', height: '550px', marginTop: 10, display: 'grid', justifyContent: 'center', alignItems: 'center'}}>
                    <img style={{width: 350, height: 500}} src={generateImage(selectedOrder?.billImage)}/>
                  </div>
                </div>
                : null
            }

          </div>
        </div>
      </Modal>
    </div>
  );
};

const customStyles = {
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    position: 'fixed',
    justifyContent: 'center',
    zIndex: 1000
    // backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    height: 'auto',
    padding: 0,
    overflow: 'auto',
    maxWidth: '674px',
    maxHeight: '769px',
    background: '#fff',
    borderRadius: '8px',
    position: 'absolute',
    top: 'calc(50vh - 23rem)',
    left: 'calc(50vw - 370px)',
    WebkitOverflowScrolling: 'touch',
    boxShadow: '0 4px 10px 1px rgb(0 0 0 / 0.8)',
  },
};

export default connect(state =>
    ({
      riderList: state.rider.get('riderList'),
      currentUser: state.login.get('currentUser'),
      alertStatus: state.common.get('alertStatus'),
      // selectedShop: state.shop.get('selectedShop'),
      orderListData: state.order.get('orderListData'),
    }),
  ({
    openAlertBox: Actions.common.openAlertBox,
    fetchPaginateAllOrders: Actions.order.fetchPaginateAllOrders,
  }),
)(OrderView);


const orderStatusList = {
  ORDER_COMPLETED: "Completed",
  ORDER_CREATED: "Pending",
  PAY_FULL_PRICE: "Pay Full Price",
  RIDER_ACCEPTED: "Rider Accepted",
  CUSTOMER_PAID_FREE_ORDER: "Rider Accepted",
  BILL_UPLOAD: "Bill Uploaded"
};

const paymentTypeList = {
  CREDIT_CARD: "Credit Card",
  CASH_ON_DELIVERY: "Cash on Delivery"
};
