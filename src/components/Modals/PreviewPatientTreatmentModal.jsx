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
import CloseIcon from "../../assets/svgs/close-icon.svg";
import ImageComponent from "../UploadImage";
import {v4 as uuid} from "uuid";
import ShopRepository from "../../internals/repository/ShopRepository";
import {CircularProgress} from "@material-ui/core";
import Button from "@material-ui/core/Button";
require('./Styles.css')
const { innerHeight } = window;

const MyTextInput = ({label, isLable, ...props}) => {
    const [field, meta] = useField(props);

    return (
        <div className={'add-client-input-wrapper'}>
            <label className={'add-client-value-Text'} htmlFor={props.id || props.name}>{label}</label>
            <input disabled={true} className={'add-client-input'} {...field} {...props} />
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

const PreviewPatientTreatmentModal = (props) => {
    const {isOpenModal, onCloseModal, status, patientTreatmentList, currentUser, selectedPatient, onChangeProduct, createShopProduct, selectedProductShop} = props;
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
        const param = {
            patientId: uuid(),
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            age: values.age,
            profileImage: imageKey,
            createdTime: Date.now(),
            updatedTime: Date.now(),
            createdUserId: currentUser?.uid
        };
        // onChangeProduct(param);
        // onCloseDrawer(event);

        console.log("+++++++++++++++++, param", param, currentUser)

    };

    const onSetIsOpen = () => {

    }

    const onAddFile = async (acceptedFiles) => {

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

    console.log("++++++++++++++++++++++++, patientTreatmentList", patientTreatmentList)

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
                                        initialValues={{
                                            amount: selectedPatient?.amount,
                                            treatements: selectedPatient?.treatements
                                        }}
                                        enableReinitialize={true}
                                        validationSchema={Yup.object({
                                            treatements: Yup.string()
                                                .required('Treatments must be required')
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
                                                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                                        <div>
                                                            <div style={{
                                                                fontSize: '22px',
                                                                color: '#000000',
                                                                marginTop: '10px',
                                                                marginLeft: '20px',
                                                            }}
                                                                 className="add-client-header-Text">{"Treatment Details"}</div>
                                                        </div>
                                                        <img onClick={() => onCloseModal()}
                                                             className={"cursor-pointer"}
                                                             src={CloseIcon}/>
                                                    </div>
                                                    <div
                                                        style={{overflow: 'scroll', height: innerHeight - 200}}
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
                                                                                        <div
                                                                                            style={{position: 'relative'}}>
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
                                                                                            <img
                                                                                                className={"cursor-pointer"}
                                                                                                onClick={() => onRemove(file)}
                                                                                                style={{
                                                                                                    position: 'absolute',
                                                                                                    top: '-10px',
                                                                                                    right: '-10px'
                                                                                                }} src={DeleteIcon}/>
                                                                                        </div>
                                                                                        :
                                                                                        <div
                                                                                            style={{position: 'relative'}}>
                                                                                            <img
                                                                                                className={"cursor-pointer"}
                                                                                                onClick={() => window.open(generateImage(file?.key))}
                                                                                                style={{
                                                                                                    width: '50px',
                                                                                                    height: '50px',
                                                                                                    borderRadius: '10px'
                                                                                                }} src={FileIcon}
                                                                                            />
                                                                                            <img
                                                                                                className={"cursor-pointer"}
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
            // selectedShop: state.shop.get('selectedShop'),
            orderListData: state.order.get('orderListData'),
            patientTreatmentList: state.client.get('patientTreatmentList'),
        }),
    ({
        openAlertBox: Actions.common.openAlertBox,
        fetchPaginateAllOrders: Actions.order.fetchPaginateAllOrders,
    }),
)(PreviewPatientTreatmentModal);


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

