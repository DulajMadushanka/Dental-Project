import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import './Styles.css';
import _ from "lodash";
import {Actions} from '../../../internals/app/Actions';
import {v4 as uuid} from 'uuid';
import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';
import Dropzone from "react-dropzone";
import ImageComponent from "../../../components/UploadImage";
import ShopRepository from "../../../internals/repository/ShopRepository";
import S3Image from "../../../components/S3Image";
import {generateImage} from "../../../internals/manager/ImageManager";
import Select from 'react-select';

const MyTextInput = ({label, value}) => {
  return (
    <div className={'add-client-input-wrapper'}>
      <label className={'add-client-value-Text'}>{label}</label>
      <input value={value} disabled={true} className={'add-client-input'}/>
    </div>
  );
};


export const EditCompanyWithdrawalView = props => {
  const {withdrawal, onCloseDrawer, currentUser, updateCompanyWithdrawal, createClient, salonIdList, selectedShop} = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [amount, setAmount] = useState('');
  const [isReceiptError, setIsReceiptError] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);



  useEffect(() => {
    if (!_.isNil(withdrawal)) {
      setName( _.get(withdrawal, 'user.name', ''));
      setEmail(_.get(withdrawal, 'user.email', ''));
      setPhoneNumber(_.get(withdrawal, 'user.phoneNumber', ''));
      setAmount(_.get(withdrawal, 'withdrawalAmount', 0)?.toFixed(2));
      setReceiptId(_.get(withdrawal, 'receiptId', ''));
      setAdminMessage(_.get(withdrawal, 'adminMessage', ''));
      setIsActive(withdrawal?.userStatus === "ACTIVE");

      const optionData = _.find(options, option => option?.value === withdrawal?.status);
      console.log("++++++++++++++++++++++++, optionData", optionData)
      if (optionData) {
        setSelectedOption({...optionData})
      }
    }
  }, [withdrawal]);

  const MyActiveCheckbox = ({label, isActiveStatus}) => {
    console.log("++++++++++++++++++++++++, isActiveStatus", isActiveStatus)
    return (
      <div style={{alignItems: 'center', marginRight: '30px'}}>
        <label className={'add-client-method-text'} style={{alignItems: 'center'}}>
          <input onClick={() => setIsActive(true)} checked={isActiveStatus} className={'add-client-method-input'} name="activeStatus" type="radio"/>
          {label}
        </label>
      </div>
    );
  };

  const onAddFile = async (acceptedFiles: any, type: string) => {
    setIsUploadingImage(true);
    const result = await ShopRepository.uploadToS3Image(acceptedFiles[0]);
    console.log("+++++++++++++++++++, result", result);
    if (result?.key) {
      setReceiptId(result?.key);
      setIsReceiptError(false);
    }
    setIsUploadingImage(false);
  };

  const onPressSave = (event) => {
    const params = {
      userId: withdrawal?.userId,
      withdrawalId: withdrawal?.withdrawalId,
      adminMessage,
      status: selectedOption?.value ? selectedOption?.value : "PENDING",
    };
    console.log("+++++++++++++++++++, params", params)
    updateCompanyWithdrawal(params);
    onCloseDrawer(event);
  };

  console.log("++++++++++++++++++++++++, selectedOption------", selectedOption)

  return (
    <div className={'add-client-wrapper'}>
      <div className="add-client-header-wrapper">
        <div className="add-client-header-Text">{"Withdrawal Details"}</div>
        <div
          className="add-client-header-title-Text">{"Withdraw selected rider’s payment you want"}</div>
      </div>

      <div className={'add-client-wrapper-info'}>
        <div style={{overflow: 'scroll', height: '70vh'}}>
          <div className={'add-client-form-wrapper'}>
            <MyTextInput
              label="Full Name"
              name="name"
              type="text"
              placeholder=""
              value={name}
            />
            <MyTextInput
              label="Email"
              name="email"
              type="email"
              placeholder=""
              value={email}
            />
            <MyTextInput
              label="Phone number"
              name="phoneNumber"
              type="text"
              placeholder=""
              value={phoneNumber}
            />
            <MyTextInput
              label="Amount"
              name="amount"
              type="text"
              placeholder=""
              value={amount}
            />
            <div>
              <div className={'add-client-input-wrapper'} style={{marginBottom: '10px'}}>
                <label className={'add-client-value-Text'}>Receipt</label>
              </div>
              {
                receiptId ?
                  <div className="w-auto flex relative flex-row h-48 rounded-lg border-dashed border border-sky-500">
                    <S3Image
                      url={generateImage(receiptId)}
                      className="w-auto rounded-lg"
                    />
                  </div>
                  :
                  null
              }
            </div>
            <div className={'add-client-input-wrapper'}>
              <label className={'add-client-value-Text'}>Status</label>
              <div style={{marginTop: '10px'}}>
                <Select
                  value={selectedOption}
                  onChange={setSelectedOption}
                  options={options}
                />
              </div>
            </div>
            <div className={'add-client-input-wrapper'}>
              <label className={'add-client-value-Text'}>Admin message</label>
              <textarea onChange={(text) => setAdminMessage(text?.target?.value)} rows="6" value={adminMessage} style={{height: '150px', paddingTop: '10px'}} className={'add-client-input'}/>
            </div>
          </div>
          <div className="add-client-bottom-wrapper">
            <div className="add-client-btn-wrapper">
              <button onClick={(event) => onPressSave(event)} className="add-client-save-btn" type="submit">{'Save Changes'}</button>
              <button className="add-client-discard-btn" onClick={(event) => onCloseDrawer(event)}>Discard</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(
  state => ({
    riderList: state.rider.get('riderList'),

  }),
  ({
    updateCompanyWithdrawal: Actions.withdrawal.updateCompanyWithdrawal,
  }),
)(EditCompanyWithdrawalView);

const options = [
  { value: 'RECEIVED', label: 'Received' },
  { value: 'NOT RECEIVED', label: 'Not Received' },
];
