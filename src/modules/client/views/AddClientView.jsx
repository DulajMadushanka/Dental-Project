import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import './Styles.css';
import _ from "lodash";
import {Actions} from '../../../internals/app/Actions';
import {v4 as uuid} from 'uuid';
import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';

const MyTextInput = ({label, value}) => {
console.log("++++++++++++++++++, value", value)
  return (
    <div className={'add-client-input-wrapper'}>
      <label className={'add-client-value-Text'}>{label}</label>
      <input disabled={true} value={value} className={'add-client-input'} />
    </div>
  );
};

export const AddClientView = props => {
  const {client, customersList, onCloseDrawer, currentUser, updateClient, createClient, salonIdList, selectedShop} = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isActive, setIsActive] = useState(true);

  console.log("++++++++++++++++++++++++, client", client)

  useEffect(() => {
    if (!_.isNil(client)) {
      setName( _.get(client, 'name', ''));
      setEmail(_.get(client, 'email', ''));
      setAddress(_.get(client, 'address', ''));
      setPhoneNumber(_.get(client, 'phoneNumber', ''));
      setBirthDay(_.get(client, 'birthDay', ''));
      setIsActive(client?.userStatus === "ACTIVE");
    }
  }, [client, customersList]);

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

  const MyInActiveCheckbox = ({label, isActiveStatus}) => {
    console.log("++++++++++++++++++++++++, isActiveStatus", isActiveStatus)
    return (
      <div style={{alignItems: 'center', marginRight: '30px'}}>
        <label className={'add-client-method-text'} style={{alignItems: 'center'}}>
          <input onClick={() => setIsActive(false)} checked={isActiveStatus} className={'add-client-method-input'} name="activeStatus" type="radio"/>
          {label}
        </label>
      </div>
    );
  };

  const onPressSave = (event) => {
    const params = {
      id: client?.id,
      userStatus: isActive ? "ACTIVE" : "IN_ACTIVE",
      updatedTime: Date.now()
    };
    console.log("+++++++++++++++++++, params", params)
    updateClient(params);
    onCloseDrawer(event);
  };

  return (
    <div className={'add-client-wrapper'}>
      <div className="add-client-header-wrapper">
        <div className="add-client-header-Text">{"Edit customer Details"}</div>
        <div
          className="add-client-header-title-Text">{"Change selected customer’s status you want"}</div>
      </div>
      <div className={'add-client-wrapper-info'}>
        <div>
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
              label="Birthday"
              name="birthDay"
              type="text"
              placeholder=""
              value={birthDay}
            />

            <MyTextInput
              label="Address"
              name="address"
              type="text"
              placeholder=""
              value={address}
            />

            <div style={{flexDirection: 'row', alignItems: 'center', display: 'flex', marginTop: '20px'}}>
              <MyActiveCheckbox
                label={"Active"}
                isActiveStatus={isActive}
              />
              <MyInActiveCheckbox
                label={"In Active"}
                isActiveStatus={!isActive}
              />
            </div>
          </div>
          <div className="add-client-bottom-wrapper">
            <div className="add-client-btn-wrapper">
              <button className="add-client-save-btn" onClick={(event) => onPressSave(event)}>{'Save Changes'}</button>
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
    customersList: state.client.get('customersList'),

  }),
  ({
    updateClient: Actions.client.updateClient,
  }),
)(AddClientView);
