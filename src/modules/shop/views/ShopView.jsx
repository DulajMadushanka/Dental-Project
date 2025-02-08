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
import {Col, Row} from 'react-grid-system';
import '../../../components/Transaction/transaction-component.css';
import AddProductView from "./AddProductView";
import moment from 'moment';
import {getPhotoFromRef} from "../../../internals/manager/GoogleManager";
import {router} from "../../../App";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { read, utils, writeFile } from 'xlsx';

const useStyles = makeStyles({
  list: {width: 467},
  fullList: {width: 'auto'},
});
// import {AppointmentDetailsView} from "./AppointmentDetailsView";

const columns = [
  {
    id: 'tickBox',
    label: '',
    minWidth: '22px',
  },
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
  const {currentUser, shopsList, selectedProductShop, selectFileShopProducts, openAlertBox, alertStatus, selectUserShop,
    selectProductShop, searchShops, fetchAllShops, openAlertMessage} = props;

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
  const [state, setState] = React.useState({
    right: false,
  });

  useEffect(() => {
    if (shopsList?.length > 0) {
      const data = shopsList.map((shop) => {
        return {
          id: shop?.placeId,
          shopName: shop?.shopName,
          rating: shop.rating,
          image: shop.imageRef,
          address: shop.address,
          tickBox: shop.tickBox
        };
      });
      setShopRowDetails([...data]);
    } else {
      setShopRowDetails([]);
    }
  }, [shopsList]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  };


  useEffect(() => {
    setShop(shopsList);
  }, [shopsList]);

  const toggleDrawer = (anchor, open, status, shopData) => (event) => {
    setSelectedModal(status);
    setSelectedShop(shopData);
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({...state, [anchor]: open});
  };

  const renderAddShop = (anchor) => {
    if(selectedProductShop?.length > 0) {
      router.navigate('/shop-product')
    } else {
      openAlertMessage();
    }
  };

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
    console.log("++++++++++++++++, searchhhhText", searchText)
    if (searchText && searchText?.length > 0) {
      searchShops({searchText})
    } else {
      fetchAllShops();
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

  const checkbox = (shopData) => {
    const isSelected = _.findIndex(selectedProductShop, sp => sp?.placeId === shopData?.placeId) > -1;
    return (
      <div>
        <input checked={isSelected} onClick={() => {
          console.log("+++++++++++++++++++++++++, shopData", shopData)
          const index = _.findIndex(selectedProductShop, sp => sp?.placeId === shopData?.placeId);
          if (index > -1) {
            selectedProductShop.splice(index, 1);
          } else {
            selectedProductShop.push(shopData)
          }
          selectProductShop(selectedProductShop);
        }} className={'add-client-method-input'} type="checkbox" />
      </div>
    );
  };


  const navigateFileUploadView = () => {
    if(selectedProductShop?.length > 0) {
      selectFileShopProducts(selectedProductShop);
    } else {
      openAlertMessage();
    }

  };



  const Upload = () => {
    const fileUpload = (document.getElementById('fileUpload'));
    console.log("++++++++++++++++++++++++++++, fileUpload", fileUpload)
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
      if (typeof (FileReader) !== 'undefined') {
        const reader = new FileReader();
        if (reader.readAsBinaryString) {
          reader.onload = (e) => {
            processExcel(reader.result);
          };
          reader.readAsBinaryString(fileUpload.files[0]);
        }
      } else {
        console.log("This browser does not support HTML5.");
      }
    } else {
      console.log("Please upload a valid Excel file.");
    }
  }

  const processExcel = (data) => {
    const workbook = read(data, {type: 'binary'});
    const firstSheet = workbook.SheetNames[0];
    const excelRows = utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    console.log(excelRows);
  }

  console.log("++++++++++++++++++++++++++++, selectedProductShop", selectedProductShop)

  return (
    <div className="client-wrapper">
      {/*<SuccessAlert*/}
      {/*  alertStatus={alertStatus}*/}
      {/*  onCloseAlert={(status) => openAlertBox(status, false, alertStatus.successStatus)}*/}
      {/*/>*/}
      <div>
        {
          (shopsList?.length > 0 || shopsList?.length === 0 ||
            (searchText && shopsList.length === 0 && isSearch) ||
            (searchText && shopsList.length === 0 && !isSearch) ||
            (!searchText && isSearch)) ?
            <>
              <div className="client-search-wrapper">
                <Row>
                  <Col xxl={8} xl={8} md={8} sm={12}>
                    <Row>
                      <Col md={4}>
                        <SearchBox onChangeText={(text) =>
                          onChangeSearch(text)}
                        />
                      </Col>
                      <Col md={2} sm={7} className="client-search-btn-wrapper">
                        <Button className="client-search-btn" onClick={() => onSearchClients()}>{'Search'}</Button>
                      </Col>
                      <Col md={2}/>
                    </Row>
                  </Col>
                  <Col xxl={2} xl={2} md={4} sm={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button className="client-add-btn"
                            onClick={() => renderAddShop()}>{'Add Product'}</Button>
                  </Col>
                  <Col xxl={2} xl={2} md={4} sm={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button  className="file-add-btn"
                            onClick={() => navigateFileUploadView()}>{'File Upload'}</Button>
                    {/*<div className="upload-btn-wrapper">*/}
                    {/*  <Button className="client-add-btn"*/}
                    {/*          onClick={() => Upload()}>{'Import Products'}</Button>*/}
                    {/*  <input style={{width: 200, height: 40}} className="upload-excel" type="file" id="fileUpload" onChange={Upload}/>*/}
                    {/*</div>*/}
                  </Col>
                </Row>
              </div>

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
                        {shopRowDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                const findShop = _.find(shopsList, (shopData) => {
                                  return shopData.placeId === row.id;
                                });

                                console.log("+++++++++++++++++++++++++, shopRowDetails", shopRowDetails)

                                console.log("+++++++++++++++++++++++++, getPhotoFromRef(value)",  column.id === 'image' ? getPhotoFromRef(value) : null)

                                return (
                                  <>
                                    {
                                      column.id === 'actions' ?
                                        <TableCell
                                          className={tableClasses.cell}
                                          key={column.id} align={column.align}>
                                          <div className="client-table-action-btn" style={{width: '80px'}}>
                                            {/*<div onClick={toggleDrawer('right', true, "EDIT_CLIENT", findShop)} className="client-table-action"><img src={EditIcon}/></div>*/}
                                            {/*<div onClick={() => {setSelectedClient(client);setIsDeleteModal(!isDeleteModal)}} className="client-table-action"><img src={DeleteIcon}/></div>*/}
                                            <div onClick={() => selectUserShop(findShop)} className="client-table-action"><img src={"https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/editIcon.svg"}/></div>
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
                                              column.id === 'tickBox' ?
                                                checkbox(findShop)
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
              }
            </>
            :
            <div className={'client-empty-wrapper'}>
              <div className="client-empty-text">Oops! Don’t have any shop yet.</div>
            </div>
        }
        {
          searchText && shop.length === 0 ?
            <div className={'client-empty-wrapper'}>
              <div className="client-empty-text">No results found</div>
              <div className="client-empty-title-text">We can’t find any matching data record for your search
              </div>
            </div>
            : null
        }
      </div>
    </div>
  );
};

export default connect(state =>
    ({
      shopsList: state.shop.get('shopsList'),
      // currentUser: state.user.get('currentUser'),
      alertStatus: state.common.get('alertStatus'),
      selectedProductShop: state.shop.get('selectedProductShop'),
      assignAppointments: state.client.get('assignAppointments'),

    }),
  ({
    openAlertBox: Actions.common.openAlertBox,
    selectProductShop: Actions.shop.selectProductShop,
    searchShops: Actions.shop.searchShops,
    fetchAllShops: Actions.shop.fetchAllShops,
    openAlertMessage: Actions.shop.openAlertMessage,
    selectFileShopProducts: Actions.shop.selectFileShopProducts,
    selectUserShop: Actions.shop.selectUserShop,
  }),
)(ShopView);

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
