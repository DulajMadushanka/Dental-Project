import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import './Styles.css';
import _ from "lodash";
import {Actions} from '../../../internals/app/Actions';
import {v4 as uuid} from 'uuid';
import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';

const MyTextInput = ({label, value}) => {
  return (
    <div className={'add-client-input-wrapper'}>
      <label className={'add-client-value-Text'}>{label}</label>
      <input value={value} disabled={true} className={'add-client-input'}/>
    </div>
  );
};


export const AddRiderView = props => {
  const {rider, riderList, onCloseDrawer, currentUser, updateRider, createClient, salonIdList, selectedShop} = props;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [isActive, setIsActive] = useState(true);

  console.log("++++++++++++++++++++++++, client", rider)

  useEffect(() => {
    if (!_.isNil(rider)) {
      setName( _.get(rider, 'name', ''));
      setEmail(_.get(rider, 'email', ''));
      setAddress(_.get(rider, 'address', ''));
      setPhoneNumber(_.get(rider, 'phoneNumber', ''));
      setBirthDay(_.get(rider, 'birthDay', ''));
      setIsActive(rider?.userStatus === "ACTIVE");
    }
  }, [rider, riderList]);

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
      id: rider?.id,
      userStatus: isActive ? "ACTIVE" : "IN_ACTIVE",
      updatedTime: Date.now()
    };
    console.log("+++++++++++++++++++, params", params)
    updateRider(params);
    onCloseDrawer(event);
  };

  console.log("++++++++++++++++++++++++, isActiveStatus------", isActive)

  return (
    <div className={'add-client-wrapper'}>
      <div className="add-client-header-wrapper">
        <div className="add-client-header-Text">{"Edit rider Details"}</div>
        <div
          className="add-client-header-title-Text">{"Change selected rider’s status you want"}</div>
      </div>

      <div className={'add-client-wrapper-info'}>
        <div style={{overflow: 'scroll', height: '65vh'}}>
          <div className={'add-client-form-wrapper'}>
            <div style={{fontFamily: 'Inter',
              color: '#000',
              fontSize: '19px', marginBottom: '10px'}}>
              Personal Details
            </div>
            <div style={{flexDirection: 'row', alignItems: 'center', display: 'flex', marginTop: '20px', marginBottom: '20px'}}>
              <MyActiveCheckbox
                label={"Active"}
                isActiveStatus={isActive}
              />
              <MyInActiveCheckbox
                label={"In Active"}
                isActiveStatus={!isActive}
              />
            </div>
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
          </div>
          <div className={'add-client-form-wrapper'}>
            <div style={{fontFamily: 'Inter',
              color: '#000',
              fontSize: '19px', marginBottom: '10px', marginTop: '20px'}}>
              Vehicle Details
            </div>
            <MyTextInput
              label="Vehicle type"
              name="name"
              type="text"
              placeholder=""
              value={''}
            />
            <MyTextInput
              label="Vehicle color"
              name="phoneNumber"
              type="text"
              placeholder=""
              value={''}
            />

            <MyTextInput
              label="vehicle model"
              name="birthDay"
              type="text"
              placeholder=""
              value={''}
            />
          </div>
          <div className={'add-client-form-wrapper'}>
            <div style={{fontFamily: 'Inter',
              color: '#000',
              fontSize: '19px', marginBottom: '10px', marginTop: '20px'}}>
              Licence And Insurance Details
            </div>
            <MyTextInput
              label="license plate number"
              name="name"
              type="text"
              placeholder=""
              value={''}
            />
            <MyTextInput
              label="Policy number"
              name="phoneNumber"
              type="text"
              placeholder=""
              value={''}
            />

            <MyTextInput
              label="Insurance company"
              name="birthDay"
              type="text"
              placeholder=""
              value={''}
            />
            <MyTextInput
              label="License expire date"
              name="birthDay"
              type="text"
              placeholder=""
              value={''}
            />
            <MyTextInput
              label="Insurance expire date"
              name="birthDay"
              type="text"
              placeholder=""
              value={''}
            />
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
    updateRider: Actions.rider.updateRider,
  }),
)(AddRiderView);
