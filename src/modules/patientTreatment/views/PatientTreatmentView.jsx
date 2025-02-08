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
import AddPatientTreatmentModal from "../../../components/Modals/AddPatientTreatmentModal";
import EditPatientTreatmentModal from "../../../components/Modals/EditPatientTreatmentModal";
import PreviewPatientTreatmentModal from "../../../components/Modals/PreviewPatientTreatmentModal";
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
    id: 'amount',
    label: 'AMOUNT',
    minWidth: '122px',
  },
  {
    id: 'createdDate',
    label: 'DATE',
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


const PatientTreatmentView = (props) => {
  const {currentUser, allPatientTreatmentList, isPatientTreatmentSearchLoading, changePatientTreatmentSearchLoading, fetchAllPatientTreatments, searchPatientTreatment, deletePatientTreatment, selectedShop} = props;

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
    if (allPatientTreatmentList?.length > 0) {
      const data = allPatientTreatmentList.map((client) => {
        console.log(client);
        return {
          patientId: client?.patientId,
          treatementId: client?.treatementId,
          name: client?.name,
          phoneNumber: client.phoneNumber,
          amount: client.amount ? `Rs ${parseFloat(client.amount).toFixed(2)}` : 'Rs 0.00',
          createdDate: client.createdDate
        };
      });
      setClientRowDetails([...data]);
    } else {
      setClientRowDetails([]);
    }
  }, [allPatientTreatmentList]);

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


  const onSearchClients = () => {
    if (searchText && searchText?.length > 0) {
      changePatientTreatmentSearchLoading(true);
      searchPatientTreatment({searchText: searchText})
    } else {
      changePatientTreatmentSearchLoading(true);
      fetchAllPatientTreatments()
    }
    setIsSearch(true);
  };

  const onDeletePatient = (patient) => {
    console.log("+++++++++++++++++++++, client", patient)
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this treatment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        const param = {
          treatementId: patient?.treatementId,
          status: "DELETED",
          updatedTime: Date.now(),
          deletedUserId: currentUser?.id
        }

        deletePatientTreatment(param)
      }
    });
  }


  const onChangeSearch = (text) => {
    setIsSearch(false);
    setSearchText(text);
    if (!text) {
      setIsSearch(true);
      changePatientTreatmentSearchLoading(true)
      fetchAllPatientTreatments();
    }
  };

  console.log("++++++++++++++++++++++deiujjjjeidheid, patientList", allPatientTreatmentList)

  return (
    <div className="client-wrapper">
      {/*<SuccessAlert*/}
      {/*  alertStatus={alertStatus}*/}
      {/*  onCloseAlert={(status) => openAlertBox(status, false, alertStatus.successStatus)}*/}
      {/*/>*/}
      <div>
        {
          (allPatientTreatmentList?.length > 0 ||
            (searchText && allPatientTreatmentList.length === 0 && isSearch) ||
            (searchText && allPatientTreatmentList.length === 0 && !isSearch) ||
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
                          isPatientTreatmentSearchLoading ?
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
                    <Button className="client-add-btn w-[300px]"
                            onClick={() => {
                              setSelectedPatient({});
                              setIsOpenAddPatientModal(true)
                            }}>{'Add Treatment'}</Button>
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
                                const client = _.find(allPatientTreatmentList, (client) => {
                                  return client.treatementId === row.treatementId;
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
                                            }} className="client-table-action"><img src={DeleteIcon}/></div>
                                            <div onClick={() => {
                                              setSelectedPatient(client);
                                              setIsOpenEditPatientModal(true)
                                            }}
                                                 className="client-table-action">
                                              <img src={EditIcon}/>
                                            </div>
                                            <div onClick={(event) => {
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
              <div className="client-empty-text">Oops! Don’t have any patient treatments yet.</div>
              <div className={"flex justify-center items-center"}>
                <Button className="client-add-btn"
                        onClick={() => {
                          setSelectedPatient({});
                          setIsOpenAddPatientModal(true)
                        }}>{'Add Treatment'}</Button>
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
          <AddPatientTreatmentModal
              isOpenModal={isOpenAddPatientModal}
              onCloseModal={() => {
                setIsOpenAddPatientModal(false)
              }}
          />
          <EditPatientTreatmentModal
              selectedPatient={selectedPatient}
              isOpenModal={isOpenEditPatientModal}
              onCloseModal={() => {
                setIsOpenEditPatientModal(false)
              }}
          />
          <PreviewPatientTreatmentModal
              selectedPatient={selectedPatient}
              isOpenModal={isOpenPreviewPatientModal}
              onCloseModal={() => {
                setIsOpenPreviewPatientModal(false)
              }}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(state =>
    ({
      allPatientTreatmentList: state.patientTreatment.get('allPatientTreatmentList'),
      // currentUser: state.user.get('currentUser'),
      alertStatus: state.common.get('alertStatus'),
      isPatientTreatmentSearchLoading: state.patientTreatment.get('isPatientTreatmentSearchLoading'),
      assignAppointments: state.client.get('assignAppointments'),
    }),
  ({
    deletePatientTreatment: Actions.patientTreatment.deletePatientTreatment,
    searchPatientTreatment: Actions.patientTreatment.searchPatientTreatment,
    fetchAllPatientTreatments: Actions.patientTreatment.fetchAllPatientTreatments,
    changePatientTreatmentSearchLoading: Actions.patientTreatment.changePatientTreatmentSearchLoading,

  }),
)(PatientTreatmentView);

