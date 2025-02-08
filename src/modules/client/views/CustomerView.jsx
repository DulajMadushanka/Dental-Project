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
import {CircularProgress, makeStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {Col, Row} from 'react-grid-system';
import '../../../components/Transaction/transaction-component.css';
import AddClientView from "./AddClientView";
import moment from 'moment';
import {router} from "../../../App";
import {CreatePatientView} from "../views/CreatePatientView";
import AddPatientModal from "../../../components/Modals/AddPatientModal";
import EditPatientModal from "../../../components/Modals/EditPatientModal";
import PreviewPatientModal from "../../../components/Modals/PreviewPatientModal";
import Swal from "sweetalert2";

const useStyles = makeStyles({
  list: {width: 467},
  fullList: {width: 'auto'},
});
// import {AppointmentDetailsView} from "./AppointmentDetailsView";

const columns = [
  {
    id: 'name',
    label: 'NAME',
    minWidth: '190px',
  },
  {
    id: 'phoneNumber',
    label: 'PHONE NUMBER',
    minWidth: '122px',
  },
  {
    id: 'age',
    label: 'AGE',
    minWidth: '122px',
  },
  {
    id: 'address',
    label: 'ADDRESS',
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
  const {currentUser, patientList, isPatientSearchLoading, changePatientSearchLoading, fetchPatientTreatments, fetchAllPatients, searchPatient, clearPatientTreatments, deletePatient, selectedShop} = props;

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState({});
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [isOpenAddPatientModal, setIsOpenAddPatientModal] = useState(false);
  const [isOpenEditPatientModal, setIsOpenEditPatientModal] = useState(false);
  const [isOpenPreviewPatientModal, setIsOpenPreviewPatientModal] = useState(false);
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [clientRowDetails, setClientRowDetails] = useState([]);
  const tableClasses = useTableStyles();
  const [selectedModal, setSelectedModal] = useState(null);
  const [state, setState] = React.useState({
    right: false,
  });

  useEffect(() => {
    if (patientList?.length > 0) {
      const data = patientList.map((client) => {
        console.log(client);
        return {
          patientId: client?.patientId,
          name: client?.name,
          email: client.email,
          phoneNumber: client.phoneNumber,
          birthDate: client.birthDate,
          address: client.address,
          firstName: client.firstName,
          lastName: client.lastName,
          profileImage: client.profileImage,
          age: client.age,
        };
      });
      setClientRowDetails([...data]);
    } else {
      setClientRowDetails([]);
    }
  }, [patientList]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  };

  const toggleDrawer = (anchor, open, status, client) => (event) => {
    setSelectedModal(status);
    setSelectedPatient(client);
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({...state, [anchor]: open});
  };

  const renderAddClient = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <AddClientView
        status={selectedModal}
        client={selectedClient}
        onCloseDrawer={toggleDrawer('right', false, null)}
      />
    </div>
  );

  const onSearchClients = () => {
    if (searchText && searchText?.length > 0) {
      changePatientSearchLoading(true);
      searchPatient({searchText: searchText})
    } else {
      changePatientSearchLoading(true);
      fetchAllPatients()
    }
    setIsSearch(true);
  };

  const onDeletePatient = (patient) => {
    console.log("+++++++++++++++++++++, client", patient)
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this patient?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        const param = {
          patientId: patient?.patientId,
          status: "DELETED",
          updatedTime: Date.now(),
          deletedUserId: currentUser?.id
        }

        deletePatient(param)
      }
    });
  }


  const onChangeSearch = (text) => {
    setIsSearch(false);
    setSearchText(text);
    if (!text) {
      setIsSearch(true);
      changePatientSearchLoading(true)
      fetchAllPatients();
    }
  };

  console.log("++++++++++++++++++++++deiujjjjeidheid, patientList", patientList)

  return (
    <div className="client-wrapper">
      {/*<SuccessAlert*/}
      {/*  alertStatus={alertStatus}*/}
      {/*  onCloseAlert={(status) => openAlertBox(status, false, alertStatus.successStatus)}*/}
      {/*/>*/}
      <div>
        {
          (patientList?.length > 0 ||
            (searchText && patientList.length === 0 && isSearch) ||
            (searchText && patientList.length === 0 && !isSearch) ||
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
                      <Col md={2} sm={7} xs={7} className="client-search-btn-wrapper">
                        <div className="client-search-btn cursor-pointer" onClick={() => onSearchClients()}>{'Search'}</div>
                        {
                          isPatientSearchLoading ?
                              <div style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                                position: 'absolute',
                                height: '45px',
                                width: '164px',
                                top: 0
                              }}
                              >
                                <CircularProgress
                                    size={25}
                                    style={{color: "blue"}}
                                />
                              </div>
                              : null
                        }
                      </Col>
                      <Col md={2} sm={0}/>
                    </Row>
                  </Col>
                  <Col xxl={2} xl={2} md={4} sm={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button className="client-add-btn"
                            onClick={() => {
                              clearPatientTreatments()
                              setSelectedPatient({});
                              setIsOpenAddPatientModal(true)
                            }}>{'Add Patient'}</Button>
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
                        {clientRowDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                          return (
                            <TableRow hover tabIndex={-1} key={row.code}>
                              {columns.map((column) => {
                                const value = row[column.id];
                                const client = _.find(patientList, (client) => {
                                  return client.patientId === row.patientId;
                                });

                                return (
                                  <>
                                    {
                                      column.id === 'actions' ?
                                        <TableCell
                                          className={tableClasses.cell}
                                          key={column.id} align={column.align}>
                                          <div className="client-table-action-btn">
                                            <div onClick={(event) => {

                                              onDeletePatient(client)
                                              // setSelectedPatient(client);
                                              // setIsOpenPreviewPatientModal(true)
                                            }} className="client-table-action"><img src={DeleteIcon}/></div>
                                            <div onClick={() => {
                                              clearPatientTreatments()
                                              fetchPatientTreatments({patientId: client?.patientId})
                                              setSelectedPatient(client);
                                              setIsOpenEditPatientModal(true)
                                            }}
                                                 className="client-table-action">
                                              <img src={EditIcon}/>
                                            </div>
                                            <div onClick={(event) => {
                                              clearPatientTreatments()
                                              fetchPatientTreatments({patientId: client?.patientId})
                                              // event.preventDefault();
                                              setSelectedPatient(client);
                                              setIsOpenPreviewPatientModal(true)
                                            }} className="client-table-action"><img src={InformationIcon}/></div>
                                            {/*<div onClick={toggleDrawer('right', true, "EDIT_CLIENT", client)} className="client-table-action"><img src={InformationIcon}/></div>*/}
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
                    count={clientRowDetails.length}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[10, 15, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </div>
              }
            </>
            :
            <div className={'client-empty-wrapper'}>
              <div className="client-empty-text">Oops! Don’t have any patients yet.</div>
              <div className={"flex justify-center items-center"}>
                <Button className="client-add-btn"
                        onClick={() => {
                          setSelectedPatient({});
                          setIsOpenAddPatientModal(true)
                        }}>{'Add Patient'}</Button>
              </div>
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
          <AddPatientModal
              isOpenModal={isOpenAddPatientModal}
              onCloseModal={() => {
                setIsOpenAddPatientModal(false)
              }}
          />
          <EditPatientModal
              selectedPatient={selectedPatient}
              isOpenModal={isOpenEditPatientModal}
              onCloseModal={() => {
                setIsOpenEditPatientModal(false)
              }}
          />
          <PreviewPatientModal
              selectedPatient={selectedPatient}
              isOpenModal={isOpenPreviewPatientModal}
              onCloseModal={() => {
                setIsOpenPreviewPatientModal(false)
              }}
          />
          {/*<Drawer anchor={"right"} open={state["right"]} onClose={toggleDrawer("right", false, null, null)}>*/}
          {/*  {*/}
          {/*    (selectedModal === "ADD_PATIENT" || selectedModal === "EDIT_CLIENT") ?*/}
          {/*        renderAddProduct("right")*/}
          {/*      : selectedModal === "APPOINTMENT_DETAILS" ?*/}
          {/*      renderAppointmentDetails("right")*/}
          {/*      : <div/>*/}

          {/*  }*/}
          {/*</Drawer>*/}
        </div>
      </div>
    </div>
  );
};

export default connect(state =>
    ({
      patientList: state.client.get('patientList'),
      // currentUser: state.user.get('currentUser'),
      alertStatus: state.common.get('alertStatus'),
      isPatientSearchLoading: state.client.get('isPatientSearchLoading'),
      assignAppointments: state.client.get('assignAppointments'),
    }),
  ({
    openAlertBox: Actions.common.openAlertBox,
    fetchPatientTreatments: Actions.client.fetchPatientTreatments,
    clearPatientTreatments: Actions.client.clearPatientTreatments,
    deletePatient: Actions.client.deletePatient,
    searchPatient: Actions.client.searchPatient,
    fetchAllPatients: Actions.client.fetchAllPatients,
    changePatientSearchLoading: Actions.client.changePatientSearchLoading,

  }),
)(ClientView);

