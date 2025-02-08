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
import { read, utils, writeFile } from 'xlsx';
import BackIcon from "../../../assets/svgs/back.svg";
import EditProductView from "./EditProductView";
import {v4 as uuid} from 'uuid';
import {CreateProductView} from "./CreateProductView";

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
    id: 'productName',
    label: 'PRODUCT NAME',
    minWidth: '190px',
  },
  {
    id: 'description',
    label: 'DESCRIPTION',
    minWidth: '122px',
  },
  {
    id: 'productPrice',
    label: 'PRODUCT_PRICE',
    minWidth: '122px',
  },
  {
    id: 'quantityType',
    label: 'QUANTITY TYPE',
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


const ProductView = (props) => {
  const {createShopFileProduct, selectedProductShop, openAlertBox, alertStatus, selectedUserShop, createUserProduct, resetShopState, selectedUserShopProducts, deleteUserProduct, updateUserProduct} = props;

  const [shop, setShop] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [shopRowDetails, setShopRowDetails] = useState([]);
  const [productRowDetails, setProductRowDetails] = useState([]);
  const tableClasses = useTableStyles();
  const [selectedModal, setSelectedModal] = useState(null);
  const [selectedTab, setSelectedTab] = useState("SHOP");
  const [selectedProductList, setSelectedProductList] = useState([]);
  const [state, setState] = React.useState({
    right: false,
  });

  useEffect(() => {
    if (selectedUserShopProducts?.length > 0) {
      const data = selectedUserShopProducts.map((product) => {
        console.log("++++++++++++++++, product", product)
        return {
          productId: product?.productId,
          productName: product?.productName,
          description: product.description,
          productPrice: product.productPrice,
          quantityType: Array.isArray(product?.quantityType) ? getProductText(product?.quantityType) : product?.quantityType,
        };
      });
      setProductRowDetails([...data]);
    } else {
      setProductRowDetails([]);
    }
  }, [selectedUserShopProducts]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  };

  const getProductText = (lists) => {
    const productData = lists.map((list) => list?.label)
    return productData.join(", ")
  };


  useEffect(() => {
    setShop(selectedUserShopProducts);
  }, [selectedUserShopProducts]);

  const toggleDrawer = (anchor, open, status, shopData) => (event) => {
    setSelectedProduct(shopData);
    setSelectedModal(status);
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({...state, [anchor]: open});
  };

  const renderEditProduct = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <EditProductView
        product={selectedProduct}
        onCloseDrawer={toggleDrawer('right', false, null)}
        onChangeProduct={({productName, description, productPrice, productId, productImage, quantityType}) => {
          console.log("+++++++++++++++++++++++++++, quantityType----------", quantityType)
          updateUserProduct({productName, productId, description, productPrice, productImage, quantityType});
        }}
      />
    </div>
  );

  const renderAddProduct = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <CreateProductView
        selectedUserShop={selectedUserShop}
        onCloseDrawer={toggleDrawer('right', false, null)}
        onChangeProduct={(param) => {
          createUserProduct(param);
        }}
      />
    </div>
  );

  console.log("++++++++++++++++, selectedUserShop", selectedUserShop)

  const Upload = () => {
    const fileUpload = (document.getElementById('fileUpload'));
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

    const result = excelRows.map((fileData) => {
      return {
        productName: fileData.productName,
        quantityType: fileData.quantityType,
        productId: uuid()
      }
    })
    setSelectedProductList([...result]);
    setSelectedTab("PRODUCT");
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

  const onPressSave = (values, event) => {
    console.log("++++++++++++++++++++, values", values)
    const param = {
      shopList: selectedProductShop,
      productList: selectedProductList
    };

    createShopFileProduct(param);
  };

  const onDeleteProduct = (productData) => {
    console.log("+++++++++++++++++, productData", productData)
    console.log("+++++++++++++++++, selectedProductList", selectedProductList)
    deleteUserProduct(productData.productId);
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
                  <Col md={2}>
                    <div style={{cursor: 'pointer'}} onClick={() => {
                      resetShopState();
                    }}>
                      <img src={BackIcon}/>
                    </div>
                  </Col>
                  <Col md={2}>

                  </Col>
                  <Col md={2} sm={7} className="client-search-btn-wrapper">

                  </Col>
                  <Col md={2}/>
                </Row>
              </Col>
              <Col xxl={2} xl={2} md={4} sm={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <div className="upload-btn-wrapper">
                  <Button className="client-add-btn"
                          onClick={toggleDrawer('right', true, "ADD_PRODUCT", null)}>{'Create Product'}</Button>
                </div>
              </Col>
            </Row>
          </div>
          <div className={tableClasses.root}>
            <TableContainer className={tableClasses.container} style={{ height: 'calc(100vh - 235px)'}}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {productColumns.map((column) => (
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
                  {productRowDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover tabIndex={-1} key={row.code}>
                        {productColumns.map((column) => {
                          const value = row[column.id];
                          const productData = _.find(selectedUserShopProducts, (client) => {
                            return client.productId === row.productId;
                          });

                          return (
                            <>
                              {
                                column.id === 'actions' ?
                                  <TableCell
                                    className={tableClasses.cell}
                                    key={column.id} align={column.align}>
                                    <div className="client-table-action-btn" style={{width: '80px'}}>
                                      <div onClick={() => onDeleteProduct(productData)} className="client-table-action"><img src={DeleteIcon}/></div>
                                      <div onClick={toggleDrawer('right', true, "EDIT_PRODUCT", productData)} className="client-table-action"><img src={"https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/edit.svg"}/></div>
                                      {/*<div onClick={() => {setSelectedClient(client);setIsDeleteModal(!isDeleteModal)}} className="client-table-action"><img src={DeleteIcon}/></div>*/}
                                      {/*<div onClick={() => {}} className="client-table-action"><img src={InformationIcon}/></div>*/}
                                    </div>
                                  </TableCell>
                                  :
                                  <TableCell
                                    className={tableClasses.cell}
                                    key={column.id} align={column.align}>
                                    {
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
              count={productRowDetails.length}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[10, 15, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </>
        <div>
          <Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false, null, null)}>
            {
              selectedModal === "EDIT_PRODUCT" ?
                renderEditProduct("right")
                : selectedModal === "ADD_PRODUCT" ?
                renderAddProduct("right")
                : null

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
      selectedUserShopProducts: state.shop.get('selectedUserShopProducts'),
      selectedUserShop: state.shop.get('selectedUserShop'),
    }),
  ({
    openAlertBox: Actions.common.openAlertBox,
    createShopFileProduct: Actions.shop.createShopFileProduct,
    resetShopState: Actions.shop.resetShopState,
    deleteUserProduct: Actions.shop.deleteUserProduct,
    updateUserProduct: Actions.shop.updateUserProduct,
    createUserProduct: Actions.shop.createUserProduct,
  }),
)(ProductView);

