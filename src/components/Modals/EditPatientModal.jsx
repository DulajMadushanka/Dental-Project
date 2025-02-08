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
            <textarea rows="10" style={{paddingTop: '10px', height: '300px'}} className={'add-client-input'} {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className={'add-client-value-error-Text'}>{meta.error}</div>
            ) : null}
        </div>
    );
};

const AddPatientModal = (props) => {
    const {isOpenModal, onCloseModal, status, updatePatient, currentUser, changePatientUpdateLoading, isPatientUpdateLoading, selectedPatient, patientTreatmentList, createShopProduct, selectedProductShop} = props;
    const phoneRef = useRef();
    const initialValues = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        age: '',
        email: ''
    };
    const isEdit = status === 'EDIT_CLIENT';
    const [countryCode, setCountryCode] = useState('');
    const [mobile, setMobile] = useState('');
    const [pressSave, setPressSave] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [isUploadingFiles, setIsUploadingFiles] = useState(false);
    const [imageKey, setImageKey] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [isShowQuantityError, setIsShowQuantityError] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const onPressSave = (values, event) => {
        changePatientUpdateLoading(true)
        const param = {
            patientId: selectedPatient?.patientId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            age: values.age,
            address: values?.address,
            profileImage: imageKey,
            updatedTime: Date.now(),
            updatedUserId: currentUser?.id
        };

        if (param.lastName) {
            param.name = `${param.firstName} ${param.lastName}`;
        } else {
            param.name = `${param.firstName}`;
        }
        param.searchedName= param.name?.toLowerCase();

        updatePatient(param)
        onCloseModal()

        console.log("+++++++++++++++++, param", param, currentUser)

    };

    useEffect(() => {
        setImageKey(selectedPatient.profileImage)
    }, [selectedPatient])

    const onSetIsOpen = () => {

    }

    const onAddFile = async (acceptedFiles) => {
        setIsUploadingImage(true)
        let fileList = uploadedFiles;
        const result = await ShopRepository.uploadToS3Image(acceptedFiles[0]);
        console.log("+++++++++++++++++++, result", result);
        if (result?.key) {
            setImageKey(result?.key);
        }
        setIsUploadingImage(true)
    };

    const handleChange = async (files) => {
        console.log(files)
        setIsUploadingFiles(true)
        const fileResult = await Promise.all(files.map(async (file)=> {
            let fileList = uploadedFiles;
            const result = await ShopRepository.uploadToS3Image(file);
            console.log("+++++++++++++++++++, result", result);
            if (result?.key) {
                fileList.push({
                    key: result?.key,
                    name: file?.name,
                    extension: file?.extension,
                    size: file?.size,
                    sizeReadable: file?.sizeReadable
                });
                setUploadedFiles(fileList)
            }
        }))
        console.log("++++++++++++++++++++++++, isUploadingFiles____________________")
        setIsUploadingFiles(false);
    }

    const handleError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    const onRemove = (file) => {
        console.log("++++++++++++++++, file", file)
        let fileList = uploadedFiles;
        const index = _.findIndex(fileList, fl => fl?.key === file?.key)
        console.log("++++++++++++++++, index", index)
        if (index > -1) {
            fileList.splice(index, 1);
        }
        setUploadedFiles([...fileList])
    }

    console.log("++++++++++++++++++++++++, uploadedFiles", uploadedFiles)

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
                        maxWidth: '1074px',
                        maxHeight: '789px',
                        background: '#fff',
                        borderRadius: '8px',
                        position: 'absolute',
                        top: 'calc(50vh - 23rem)',
                        left: 'calc(50vw - 470px)',
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
                            <div className={'add-client-wrapper'}>
                                <div>
                                    <div style={{
                                        fontSize: '22px',
                                        color: '#000000',
                                        marginTop: '20px',
                                        marginLeft: '20px'
                                    }}
                                         className="add-client-header-Text">{"Patient Details"}</div>
                                </div>

                                <div style={{overflow: 'scroll', height: innerHeight - 150, marginTop: '10px'}}>
                                    <Formik
                                        initialValues={initialValues}
                                        initialValues={{
                                            firstName: selectedPatient?.firstName,
                                            lastName: selectedPatient?.lastName,
                                            address: selectedPatient?.address,
                                            age: selectedPatient?.age,
                                            email: selectedPatient?.email,
                                            phoneNumber: selectedPatient?.phoneNumber
                                        }}
                                        validationSchema={Yup.object({
                                            firstName: Yup.string()
                                                .required('First name must be required'),
                                            phoneNumber: Yup.string()
                                                .required('Phone number must be required')
                                        })}
                                        onSubmit={(values, {setSubmitting}) => {
                                            onPressSave(values);
                                        }}
                                    >
                                        <Form>
                                            <div
                                                className={'add-client-form-wrapper'}>
                                                <MyTextInput
                                                    label="First Name"
                                                    name="firstName"
                                                    type="text"
                                                    placeholder="First Name"
                                                />
                                                <MyTextInput
                                                    label="Last Name"
                                                    name="lastName"
                                                    type="text"
                                                    placeholder="Last Name"
                                                />
                                                <MyTextInput
                                                    label="Email"
                                                    name="email"
                                                    type="text"
                                                    placeholder="Email"
                                                />
                                                <MyTextInput
                                                    label="Phone Number"
                                                    name="phoneNumber"
                                                    type="text"
                                                    placeholder="Phone Number"
                                                />
                                                {/*<div style={{marginTop: '10px'}}>*/}
                                                {/*  <label className={'add-client-value-Text'}>Quantity type</label>*/}
                                                {/*  <div style={{marginTop: '10px'}}>*/}
                                                {/*    <Select*/}
                                                {/*      isMulti={true}*/}
                                                {/*      value={selectedOption}*/}
                                                {/*      onChange={(data) => {*/}
                                                {/*        console.log("+++++++++++++++++++++++++++, data", data)*/}
                                                {/*        setSelectedOption(data);*/}
                                                {/*        setIsShowQuantityError(false);*/}
                                                {/*      }}*/}
                                                {/*      options={options}*/}
                                                {/*      styles={customStyles}*/}
                                                {/*    />*/}
                                                {/*  </div>*/}
                                                {/*  {*/}
                                                {/*    isShowQuantityError ?*/}
                                                {/*      <div className={'add-client-value-error-Text'}>Quantity type is required</div>*/}
                                                {/*      : null*/}
                                                {/*  }*/}
                                                {/*</div>*/}
                                                <MyTextInput
                                                    label="Age"
                                                    name="age"
                                                    type="text"
                                                    placeholder="Age"
                                                />
                                                <div className={'add-client-input-wrapper'}
                                                     style={{marginBottom: '10px'}}>
                                                    <label className={'add-client-value-Text'}>Profile image</label>
                                                </div>
                                                {
                                                    imageKey ?
                                                        <div
                                                            className="w-auto flex relative flex-row h-48 rounded-lg border-dashed border border-sky-500">
                                                            <S3Image
                                                                url={generateImage(imageKey)}
                                                                className="w-auto rounded-lg"
                                                            />
                                                            <img
                                                                alt="remove"
                                                                src={ImageRemoveIcon}
                                                                onClick={() => setImageKey('')}
                                                                className="w-6 absolute right-2 top-2 cursor-pointer"
                                                            />
                                                        </div>
                                                        :
                                                        <div>
                                                            <Dropzone
                                                                multiple={false}
                                                                onDrop={onAddFile}
                                                                accept={{
                                                                    "image/png": [".png", ".jpeg", ".HEIC", ".JPG"],
                                                                }}
                                                            >
                                                                {({getRootProps, getInputProps}: any) => (
                                                                    <ImageComponent
                                                                        getRootProps={getRootProps}
                                                                        getInputProps={getInputProps}
                                                                        loadingAction={isUploadingImage}
                                                                    />
                                                                )}
                                                            </Dropzone>
                                                        </div>
                                                }
                                            </div>
                                            <div className="add-client-btn-wrapper">
                                                <div style={{position: 'relative'}}>
                                                    <button className="add-client-save-btn"
                                                            type="submit">{'Update Patient'}</button>
                                                    {
                                                        isPatientUpdateLoading ?
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

                                    </Formik>
                                </div>
                            </div>
                        </Col>
                        <Col style={{borderLeft: '1px solid #EFF0F8'}}>
                            <div className={'add-client-wrapper'}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: '20px',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{
                                        fontSize: '22px',
                                        color: '#000000',
                                        // marginLeft: '20px'
                                    }}
                                         className="add-client-header-Text">{"History Details"}
                                    </div>
                                    <img onClick={() => onCloseModal()} className={"cursor-pointer"} src={CloseIcon}/>
                                </div>

                                <div style={{overflow: 'scroll', height: innerHeight - 150, marginTop: '10px'}}>
                                    {
                                        patientTreatmentList?.length > 0 ?
                                            patientTreatmentList.map((patientTreatment, index) => {
                                                return (
                                                    <div style={{
                                                        marginBottom: '20px',
                                                        borderBottom: patientTreatmentList?.length - 1 !== index ? '1px solid gray' : null,
                                                        paddingBottom: '20px'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center'
                                                        }}>
                                                            <img src={CalendarIcon}/>
                                                            <div style={{
                                                                color: '#000000',
                                                                fontSize: '16px',
                                                                marginLeft: '10px'
                                                            }}>
                                                                {moment(patientTreatment?.createdTime).format("YYYY-MM-DD hh:mm A")}
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            marginTop: '10px'
                                                        }}>
                                                            <img src={MoneyIcon}/>
                                                            <div style={{
                                                                color: '#000000',
                                                                fontSize: '16px',
                                                                marginLeft: '10px'
                                                            }}>
                                                                RS: {patientTreatment?.amount ? parseFloat(patientTreatment?.amount)?.toFixed(2) : "0"}
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            color: 'gray',
                                                            fontSize: '16px',
                                                            marginTop: '10px'
                                                        }}>
                                                            {patientTreatment?.treatements}
                                                        </div>
                                                        <div>
                                                            {
                                                                patientTreatment?.files?.map((file) => {
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
                                                                                        <img
                                                                                            className={"cursor-pointer"}
                                                                                            onClick={() => window.open(generateImage(file?.key))}
                                                                                            style={{
                                                                                                width: '50px',
                                                                                                height: '50px',
                                                                                                borderRadius: '10px'
                                                                                            }}
                                                                                            src={generateImage(file?.key)}
                                                                                        />
                                                                                    </div>
                                                                                    :
                                                                                    <div style={{position: 'relative'}}>
                                                                                        <img
                                                                                            className={"cursor-pointer"}
                                                                                            onClick={() => window.open(generateImage(file?.key))}
                                                                                            style={{
                                                                                                width: '50px',
                                                                                                height: '50px',
                                                                                                borderRadius: '10px'
                                                                                            }} src={FileIcon}
                                                                                        />
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
                                                )
                                            }) :
                                            <div className={'client-empty-wrapper'}>
                                                <div className="client-empty-text">Don’t have any patients history yet.
                                                </div>
                                            </div>
                                    }
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
            isPatientUpdateLoading: state.client.get('isPatientUpdateLoading'),
            orderListData: state.order.get('orderListData'),
            patientTreatmentList: state.client.get('patientTreatmentList'),
        }),
    ({
        openAlertBox: Actions.common.openAlertBox,
        fetchPaginateAllOrders: Actions.order.fetchPaginateAllOrders,
        updatePatient: Actions.client.updatePatient,
        changePatientUpdateLoading: Actions.client.changePatientUpdateLoading,
    }),
)(AddPatientModal);


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

