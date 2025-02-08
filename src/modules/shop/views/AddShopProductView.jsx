import React, {useEffect, useState} from 'react';
import SearchBox from '../../../components/SearchBox/index';
import InformationIcon from '../../../assets/svgs/informationIcon.svg';
import EditIcon from '../../../assets/svgs/editIcon.svg';
import DeleteIcon from '../../../assets/svgs/deleteIcon.svg';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import clsx from "clsx";
import Drawer from '@material-ui/core/Drawer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {Actions} from "../../../internals/app/Actions";
import {makeStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {Col, Row} from 'react-grid-system'
import '../../../components/Transaction/transaction-component.css';
import AddProductView from "./AddProductView";
import BackIcon from '../../../assets/svgs/back.svg';
import moment from 'moment';
import {getPhotoFromRef} from "../../../internals/manager/GoogleManager";
import {router} from "../../../App";

const useStyles = makeStyles({
  list: {width: 467},
  fullList: {width: 'auto'},
});
// import {AppointmentDetailsView} from "./AppointmentDetailsView";

const shopColumns = [
  {
    id: 'image',
    label: 'IMAGE',
    minWidth: '122px',
  },
  {
    id: 'shopName',
    label: 'SHOP NAME',
    minWidth: '190px',
  },
  {
    id: 'address',
    label: 'ADDRESS',
    minWidth: '122px',
  },
  {
    id: 'rating',
    label: 'RATING',
    minWidth: '165px',
  },
];

const productColumns = [
  {
    id: 'image',
    label: 'IMAGE',
    minWidth: '122px',
  },
  {
    id: 'shopName',
    label: 'SHOP NAME',
    minWidth: '190px',
  },
  {
    id: 'address',
    label: 'ADDRESS',
    minWidth: '122px',
  },
  {
    id: 'rating',
    label: 'RATING',
    minWidth: '165px',
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


const ShopView = (props) => {
  const {currentUser, selectedProductShop, openAlertBox, alertStatus, resetShopState} = props;

  const [shop, setShop] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [shopRowDetails, setShopRowDetails] = useState([]);
  const tableClasses = useTableStyles();
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedTab, setSelectedTab] = useState("SHOP");
  const [state, setState] = React.useState({
    right: false,
  });

  useEffect(() => {
    if (selectedProductShop?.length > 0) {
      const data = selectedProductShop.map((shop) => {
        return {
          id: shop?.placeId,
          shopName: shop?.shopName,
          rating: shop.rating,
          image: shop.imageRef,
          address: shop.address
        };
      });
      setShopRowDetails([...data]);
    } else {
      setShopRowDetails([]);
    }
  }, [selectedProductShop]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  };


  useEffect(() => {
    setShop(selectedProductShop);
  }, [selectedProductShop]);

  const toggleDrawer = (anchor, open, status, shopData) => (event) => {
    setSelectedModal(status);
    setSelectedShop(shopData);
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({...state, [anchor]: open});
  };

  const renderAddShop = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <AddProductView
        status={selectedModal}
        client={selectedShop}
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

  const deleteClientDetails = () => {
    setIsDeleteModal(false);
  };

  const onSearchClients = () => {
    if (searchText && searchText?.length > 0) {
      // const filterList = _.filter(customersList, item => (item?.name?.toLowerCase()).includes(searchText.toLowerCase()));
      // setClients([...filterList]);
    } else {

    }
    setIsSearch(true);
  };

  const onChangeSearch = (text) => {
    setIsSearch(false);
    setSearchText(text);
    if (!text) {
      setIsSearch(true);
    }
  };

  return (
    <div className="client-wrapper">
      {/*<SuccessAlert*/}
      {/*  alertStatus={alertStatus}*/}
      {/*  onCloseAlert={(status) => openAlertBox(status, false, alertStatus.successStatus)}*/}
      {/*/>*/}
      <div>
        <>
          <div className="client-search-wrapper">
            <Row>
              <Col xxl={10} xl={10} md={8} sm={12}>
                <Row>
                  <Col md={2} sm={7} className="client-search-btn-wrapper">
                    <div style={{cursor: 'pointer'}} onClick={() => {
                      resetShopState();
                    }}>
                      <img src={"https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/back.svg"}/>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div onClick={() => setSelectedTab("SHOP")}>
                      <div style={{fontSize: '15pt'}}>
                        Selected Shop List
                      </div>
                    </div>
                  </Col>
                  <Col md={2}/>
                </Row>
              </Col>
              <Col xxl={2} xl={2} md={4} sm={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button className="client-add-btn"
                        onClick={toggleDrawer('right', true, "ADD_PRODUCT", null)}>{'Create Product'}</Button>
              </Col>
            </Row>
          </div>

          {
            selectedTab === "SHOP" ?
              <div className={tableClasses.root}>
                <TableContainer className={tableClasses.container} style={{ height: 'calc(100vh - 235px)'}}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {shopColumns.map((column) => (
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
                      {shopRowDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        return (
                          <TableRow hover tabIndex={-1} key={row.code}>
                            {shopColumns.map((column) => {
                              const value = row[column.id];
                              const client = _.find(selectedProductShop, (client) => {
                                return client.id === row.id;
                              });

                              return (
                                <>
                                  {
                                    column.id === 'actions' ?
                                      <TableCell
                                        className={tableClasses.cell}
                                        key={column.id} align={column.align}>
                                        <div className="client-table-action-btn">
                                          <div onClick={toggleDrawer('right', true, "EDIT_CLIENT", client)} className="client-table-action"><img src={"https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/editIcon.svg"}/></div>
                                          {/*<div onClick={() => {setSelectedClient(client);setIsDeleteModal(!isDeleteModal)}} className="client-table-action"><img src={DeleteIcon}/></div>*/}
                                          {/*<div onClick={() => {}} className="client-table-action"><img src={InformationIcon}/></div>*/}
                                        </div>
                                      </TableCell>
                                      :
                                      <TableCell
                                        className={tableClasses.cell}
                                        key={column.id} align={column.align}>
                                        {
                                          column.id === 'image' ?
                                            <img src={getPhotoFromRef(value)} style={{width: '80px', height: '50px', borderRadius: '10px'}}/>
                                            :
                                            value
                                        }

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
                <TablePagination
                  page={page}
                  component="div"
                  rowsPerPage={rowsPerPage}
                  count={shopRowDetails.length}
                  onPageChange={handleChangePage}
                  rowsPerPageOptions={[10, 15, 25]}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
              :
              <div />
          }
        </>
        <div>
          <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false, null, null)}>
            {
              (selectedModal === "ADD_PRODUCT" || selectedModal === "EDIT_CLIENT") ?
                renderAddShop("right")
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
      shopsList: state.shop.get('shopsList'),
      // currentUser: state.user.get('currentUser'),
      alertStatus: state.common.get('alertStatus'),
      // selectedShop: state.shop.get('selectedShop'),
      assignAppointments: state.client.get('assignAppointments'),
      selectedProductShop: state.shop.get('selectedProductShop'),
    }),
  ({
    openAlertBox: Actions.common.openAlertBox,
    resetShopState: Actions.shop.resetShopState,
  }),
)(ShopView);

