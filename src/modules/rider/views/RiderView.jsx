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
import AddRiderView from "./AddRiderView";

const useStyles = makeStyles({
  list: {width: 467},
  fullList: {width: 'auto'},
});
// import {AppointmentDetailsView} from "./AppointmentDetailsView";

const columns = [
  {
    id: 'clientName',
    label: 'RIDER NAME',
    minWidth: '190px',
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
    id: 'birthDate',
    label: 'BIRTHDAY',
    minWidth: '122px',
  },
  {
    id: 'address',
    label: 'ADDRESS',
    minWidth: '122px',
  },
  {
    id: 'userStatus',
    label: 'USER STATUS',
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


const ClientView = (props) => {
  const {currentUser, riderList, assignAppointments, openAlertBox, alertStatus, selectedShop} = props;

  const [clients, setClients] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [riderRowDetails, setRiderRowDetails] = useState([]);
  const tableClasses = useTableStyles();
  const [selectedModal, setSelectedModal] = useState(null);
  const [state, setState] = React.useState({
    right: false,
  });

  useEffect(() => {
    if (riderList?.length > 0) {
      const data = riderList.map((rider) => {
        return {
          id: rider?.id,
          clientName: rider?.name,
          email: rider.email,
          phoneNumber: rider.phoneNumber,
          birthDate: rider.birthDate,
          address: rider.address,
          userStatus: rider?.userStatus?.toLowerCase()
        };
      });
      setRiderRowDetails([...data]);
    } else {
      setRiderRowDetails([]);
    }
  }, [riderList]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  };


  useEffect(() => {
    setClients(riderList);
  }, [riderList]);

  const toggleDrawer = (anchor, open, status, rider) => (event) => {
    setSelectedModal(status);
    setSelectedRider(rider);
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({...state, [anchor]: open});
  };

  const renderAddRider = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <AddRiderView
        status={selectedModal}
        rider={selectedRider}
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
        {
          (riderList?.length > 0 ||
            (searchText && riderList.length === 0 && isSearch) ||
            (searchText && riderList.length === 0 && !isSearch) ||
            (!searchText && isSearch)) ?
            <>
              <div className="client-search-wrapper">
                <Row>
                  <Col xxl={10} xl={10} md={8} sm={12}>
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
                        {riderRowDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                const client = _.find(riderList, (client) => {
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
                                            <div onClick={toggleDrawer('right', true, "EDIT_RIDER", client)} className="client-table-action"><img src={"https://basketbuddy-s3-bucket.s3.ap-southeast-1.amazonaws.com/public/editIcon.svg"}/></div>
                                            {/*<div onClick={() => {setSelectedClient(client);setIsDeleteModal(!isDeleteModal)}} className="client-table-action"><img src={DeleteIcon}/></div>*/}
                                            {/*<div onClick={toggleDrawer(?'right', true, "EDIT_RIDER", client)} className="client-table-action"><img src={InformationIcon}/></div>*/}
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
                  <TablePagination
                    page={page}
                    component="div"
                    rowsPerPage={rowsPerPage}
                    count={riderRowDetails.length}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[10, 15, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
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
      // currentUser: state.user.get('currentUser'),
      alertStatus: state.common.get('alertStatus'),
      // selectedShop: state.shop.get('selectedShop'),
      assignAppointments: state.client.get('assignAppointments'),
    }),
  ({
    openAlertBox: Actions.common.openAlertBox,

  }),
)(ClientView);

