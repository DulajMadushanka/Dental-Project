import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import {Actions} from "../../internals/app/Actions";
import {makeStyles} from "@material-ui/core/index";
import {connect} from "react-redux";
import {Col, Row} from 'react-grid-system';

import Modal from 'react-modal';
import Files from 'react-files'
import moment from 'moment';
import {generateImage} from "../../internals/manager/ImageManager";
import {Form, Formik, useField} from "formik";
import * as Yup from "yup";
import S3Image from "../S3Image";
import ImageRemoveIcon from "../../assets/svgs/imageRemoveIcon.svg";
import MoneyIcon from "../../assets/svgs/money-icon.svg";
import FileIcon from "../../assets/svgs/file-icon.svg";
import DeleteIcon from "../../assets/svgs/delete-icon.svg";
import CalendarIcon from "../../assets/svgs/calendar-icon.svg";
import Dropzone from "react-dropzone";
import ImageComponent from "../UploadImage";
import {v4 as uuid} from "uuid";
import ShopRepository from "../../internals/repository/ShopRepository";
import {CircularProgress} from "@material-ui/core";
import CloseIcon from "../../assets/svgs/close-icon.svg";
import { ToastContainer, toast } from 'react-toastify';

import Autocomplete from 'react-autocomplete-select'
import Select from "react-select";
require('./Styles.css')
const { innerHeight } = window;



const MyTextInput = ({label, isLable, ...props}) => {
    const [field, meta] = useField(props);

    return (
        <div className={'add-client-input-wrapper'}>
            <label className={'add-client-value-Text'} htmlFor={props.id || props.name}>{label}</label>
            <input className={'add-client-input'} {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className={'add-client-value-error-Text'}>{meta.error}</div>
            ) : null}
        </div>
    );
};

const MyTextAreaInput = ({label, isLable, ...props}) => {
    const [field, meta] = useField(props);

    return (
        <div className={'add-client-input-wrapper'}>
            <label className={'add-client-value-Text'} htmlFor={props.id || props.name}>{label}</label>
            <textarea onChange={(e) => console.log("+++++++++++0000", e.target.value)} rows="10" style={{paddingTop: '10px', height: '300px'}} className={'add-client-input'} {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className={'add-client-value-error-Text'}>{meta.error}</div>
            ) : null}
        </div>
    );
};

const AddPatientTreatmentModal = (props) => {
    const {isOpenModal, onCloseModal, status, onCloseDrawer, changePatientTreatmentCreateLoading, isPatientTreatmentCreateLoading, currentUser, createPatientTreatment, mapPatientList, patientList, patientTreatmentList, fetchPatientTreatments} = props;
    const phoneRef = useRef();
    const isEdit = status === 'EDIT_CLIENT';
    const [countryCode, setCountryCode] = useState('');
    const [mobile, setMobile] = useState('');
    const [pressSave, setPressSave] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const [imageKey, setImageKey] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [isShowError, setIsShowError] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [initialValues, setInitialValues] = useState({
        amount: '',
        treatements: '',
        patientId: ''
    });

    useEffect(() => {
        setSelectedOption(null)
        setImageKey("");
        setInitialValues({
            amount: '',
            treatements: '',
            patientId: ''
        })
    }, [isOpenModal])

    const onPressSave = async (values, event) => {
        console.log("+++++++++++++++++++++++, values", values)
        changePatientTreatmentCreateLoading(true);
        const param = {
            treatementId: uuid(),
            patientId: values?.patientId,
            createdTime: Date.now(),
            updatedTime: Date.now(),
            createdUserId: currentUser?.id,
            updatedUserId: currentUser?.id,
            status: "ACTIVE",
            amount: values?.amount ? values?.amount : 0,
            treatements: values?.treatements,
            files: uploadedFiles,
            createdDate: moment().format("YYYY-MM-DD")
        };

        createPatientTreatment(param);
        onCloseModal()
    };

    const onSetIsOpen = () => {

    }

    const handleChangeFile = async (files) => {
        console.log(files)
        setIsUploadingFiles(true)
        const fileResult = await Promise.all(files.map(async (file)=> {
            let fileList = uploadedFiles;
            const result = await ShopRepository.uploadToS3Image(file);

            if (result?.key) {
                fileList.push({
                    key: result?.key,
                    name: file?.name,
                    extension: file?.extension,
                    size: file?.size?.toString(),
                    sizeReadable: file?.sizeReadable
                });
                setUploadedFiles(fileList)
            }
        }))

        setIsUploadingFiles(false);
    }


    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    const onRemove = (file) => {
        let fileList = uploadedFiles;
        const index = _.findIndex(fileList, fl => fl?.key === file?.key)

        if (index > -1) {
            fileList.splice(index, 1);
        }
        setUploadedFiles([...fileList])
    }

    const formatOptionLabel = ({ value, label }, { context }) => {
        const valueData = mapPatientList.find((film) => film.value === value);

        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {context === "menu" && valueData?.flagPath ? (
                    <img
                        src={valueData?.flagPath}
                        alt={value}
                        style={{ marginRight: "8px", width: "20px", height: "20px" }}
                    />
                ) : null}
                {label}
            </div>
        );
    };

    console.log("+++++++++++++++++++++++, isPatientCreateLoading", isPatientTreatmentCreateLoading)

    return (
        <div className="client-wrapper">
            <Modal
                isOpen={isOpenModal}
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
                        maxWidth: '604px',
                        maxHeight: '789px',
                        background: '#fff',
                        borderRadius: '8px',
                        position: 'absolute',
                        top: 'calc(50vh - 23rem)',
                        left: 'calc(50vw - 300px)',
                        WebkitOverflowScrolling: 'touch',
                        boxShadow: '0 4px 10px 1px rgb(0 0 0 / 0.8)',
                    },
                }}
                contentLabel="Category Modal"
                onRequestClose={() => onSetIsOpen(false)}
            >

                <div
                    className="flex flex-col w-full h-full px-6 selection:overflow-hidden shadow rounded-lg bg-[#FFFFFF] pb-[20px]">
                    <Row>
                        <Col>
                            <div>
                                <div>
                                    <Formik
                                        initialValues={initialValues}
                                        enableReinitialize={true}
                                        validationSchema={Yup.object({
                                            treatements: Yup.string()
                                                .required('Treatments must be required'),
                                            patientId: Yup.string()
                                                .required('Patient must be required')
                                        })}
                                        onSubmit={(values, {setSubmitting}) => {
                                            onPressSave(values);
                                        }}
                                    >
                                        {({
                                              values,
                                              errors,
                                              touched,
                                            setFieldValue,
                                              handleChange,
                                              handleBlur,
                                              handleSubmit,
                                              isSubmitting,
                                              /* and other goodies */
                                          }) => {

                                            return (
                                                <Form>
                                                    <div style={{
                                                        marginTop: '20px',
                                                        marginLeft: '10px',
                                                        paddingLeft: '10px'
                                                    }}>

                                                        <div style={{marginTop: '10px', marginRight: '20px'}}>
                                                            <Select
                                                                value={_.find(mapPatientList, it => it?.value === values.patientId)}
                                                                onChange={(data) => {
                                                                    setFieldValue('patientId', data?.value)
                                                                }}
                                                                options={mapPatientList}
                                                                placeholder={"Select Patient"}
                                                                styles={customSelectStyles}
                                                                formatOptionLabel={formatOptionLabel}
                                                            />
                                                            {
                                                                errors.patientId ?
                                                                    <div
                                                                        className={'add-client-value-error-Text'}>{errors.patientId}</div>:
                                                                    null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{
                                                            fontSize: '22px',
                                                            color: '#000000',
                                                            marginTop: '10px',
                                                            marginLeft: '20px'
                                                        }}
                                                             className="add-client-header-Text">{"Create Patient Treatment"}</div>
                                                    </div>
                                                    <div
                                                        style={{overflow: 'scroll', height: innerHeight - 280}}
                                                        className={'add-client-form-wrapper'}>
                                                        <div>
                                                            <MyTextInput
                                                                label="Amount"
                                                                name="amount"
                                                                type="text"
                                                                placeholder="Amount"
                                                            />
                                                            <MyTextAreaInput
                                                                label="Treatements"
                                                                name="treatements"
                                                                type="text"
                                                                placeholder="Treatements"
                                                            />
                                                            <label className={'add-client-value-Text'}>Documents</label>
                                                            <Files
                                                                className='files-dropzone'
                                                                onChange={handleChangeFile}
                                                                onError={handleError}
                                                                accepts={['image/png', 'image/jpg', 'image/jpeg', '.jpg', '.xlsx', '.pdf', 'audio/*', '.csv']}
                                                                // multiple
                                                                maxFileSize={10000000}
                                                                minFileSize={0}
                                                                clickable>
                                                                <div
                                                                    className="file-upload-icon border-dashed border border-sky-500">
                                                                    <svg
                                                                        width="30"
                                                                        height="30"
                                                                        viewBox="0 0 30 30"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <circle cx="15" cy="15" r="15" fill="#ebeef0"/>
                                                                        <path
                                                                            d="M13.5 22V19"
                                                                            stroke="#687178"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M16.5 22V19"
                                                                            stroke="#687178"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M10.5 22H19.5"
                                                                            stroke="#687178"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M7.5 16H22.5"
                                                                            stroke="#687178"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                        <path
                                                                            d="M21 8H9C8.17157 8 7.5 8.67157 7.5 9.5V17.5C7.5 18.3284 8.17157 19 9 19H21C21.8284 19 22.5 18.3284 22.5 17.5V9.5C22.5 8.67157 21.8284 8 21 8Z"
                                                                            stroke="#687178"
                                                                            stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                        />
                                                                    </svg>
                                                                    {isUploadingFiles && (
                                                                        <div style={{
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center',
                                                                            display: 'flex',
                                                                            position: 'absolute',
                                                                            top: '-3rem'
                                                                        }}
                                                                             className="h-48"
                                                                        >
                                                                            <CircularProgress
                                                                                size={25}
                                                                                style={{color: "blue"}}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Files>
                                                            <div>
                                                                {
                                                                    uploadedFiles?.map((file) => {
                                                                        const isImage = file?.extension?.includes('jpg') || file?.extension?.includes('png')
                                                                        console.log("++++++++, generateImage(file?.key)", generateImage(file?.key))
                                                                        return (
                                                                            <div key={file.key} style={{
                                                                                marginTop: '20px',
                                                                                display: 'flex',
                                                                                flexDirection: 'row',
                                                                                alignItems: 'center'
                                                                            }}>
                                                                                {
                                                                                    isImage ?
                                                                                        <div style={{position: 'relative'}}>
                                                                                            <img className={"cursor-pointer"}
                                                                                                 onClick={() => window.open(generateImage(file?.key))}
                                                                                                 style={{
                                                                                                     width: '50px',
                                                                                                     height: '50px',
                                                                                                     borderRadius: '10px'
                                                                                                 }}
                                                                                                 src={generateImage(file?.key)}
                                                                                            />
                                                                                            <img className={"cursor-pointer"}
                                                                                                 onClick={() => onRemove(file)}
                                                                                                 style={{
                                                                                                     position: 'absolute',
                                                                                                     top: '-10px',
                                                                                                     right: '-10px'
                                                                                                 }} src={DeleteIcon}/>
                                                                                        </div>
                                                                                        :
                                                                                        <div style={{position: 'relative'}}>
                                                                                            <img className={"cursor-pointer"}
                                                                                                 onClick={() => window.open(generateImage(file?.key))}
                                                                                                 style={{
                                                                                                     width: '50px',
                                                                                                     height: '50px',
                                                                                                     borderRadius: '10px'
                                                                                                 }} src={FileIcon}
                                                                                            />
                                                                                            <img className={"cursor-pointer"}
                                                                                                 onClick={() => onRemove(file)}
                                                                                                 style={{
                                                                                                     position: 'absolute',
                                                                                                     top: '-10px',
                                                                                                     right: '-10px'
                                                                                                 }} src={DeleteIcon}/>
                                                                                        </div>
                                                                                }
                                                                                <div style={{marginLeft: '10px'}}>
                                                                                    <div style={{
                                                                                        color: '#000000',
                                                                                        fontSize: '13px'
                                                                                    }}>
                                                                                        {file?.name}
                                                                                    </div>
                                                                                    <div style={{
                                                                                        color: '#000000',
                                                                                        fontSize: '13px'
                                                                                    }}>
                                                                                        {file?.sizeReadable}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="add-client-btn-wrapper">
                                                        <div style={{position: 'relative'}}>
                                                            <button className="add-client-save-btn"
                                                                    type="submit">{'Create Treatment'}</button>
                                                            {
                                                                isPatientTreatmentCreateLoading ?
                                                                    <div style={{
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        display: 'flex',
                                                                        position: 'absolute',
                                                                        height: '45px',
                                                                        width: '100%',
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
                                                        </div>
                                                        <button className="add-client-discard-btn"
                                                                onClick={() => onCloseModal()}>Discard
                                                        </button>
                                                    </div>
                                                </Form>
                                            )
                                        }}
                                    </Formik>
                                </div>
                            </div>
                        </Col>
                    </Row>

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
            mapPatientList: state.client.get('mapPatientList'),
            orderListData: state.order.get('orderListData'),
            patientList: state.client.get('patientList'),
            patientTreatmentList: state.client.get('patientTreatmentList'),
            isPatientTreatmentCreateLoading: state.patientTreatment.get('isPatientTreatmentCreateLoading'),
        }),
    ({
        openAlertBox: Actions.common.openAlertBox,
        createPatientTreatment: Actions.patientTreatment.createPatientTreatment,
        fetchPaginateAllOrders: Actions.order.fetchPaginateAllOrders,
        fetchPatientTreatments: Actions.client.fetchPatientTreatments,
        changePatientTreatmentCreateLoading: Actions.patientTreatment.changePatientTreatmentCreateLoading,
    }),
)(AddPatientTreatmentModal);

const customSelectStyles = {
    control: (base: any) => ({
        ...base,
        minHeight: "45px",
        boxShadow: "none",
        borderRadius: "8px",
        borderColor: "#97C0EB",
        "&:hover": {
            borderColor: "#D0D5DD",
        },
    }),
};

