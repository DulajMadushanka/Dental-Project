import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import './Styles.css';
import _ from "lodash";
import {Actions} from '../../../internals/app/Actions';
import {v4 as uuid} from 'uuid';
import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';
import ImageComponent from "../../../components/UploadImage";
import ShopRepository from '../../../internals/repository/ShopRepository';
import Dropzone from "react-dropzone";
import S3Image from "../../../components/S3Image";
import {generateImage} from "../../../internals/manager/ImageManager";
import ImageRemoveIcon from "../../../assets/svgs/imageRemoveIcon.svg";
import Select from 'react-select';
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

export const AddProductView = props => {
  const {client, status, onCloseDrawer, currentUser, updateClient, createClient, createShopProduct, selectedProductShop} = props;
  const phoneRef = useRef();
  const initialValues = {
    productName: '',
    quantityType: '',
    productImage: ''
  };
  const isEdit = status === 'EDIT_CLIENT';
  const [countryCode, setCountryCode] = useState('');
  const [mobile, setMobile] = useState('');
  const [pressSave, setPressSave] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageKey, setImageKey] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isShowQuantityError, setIsShowQuantityError] = useState(false);

  const onPressSave = (values, event) => {
    console.log("+++++++++++++++++++, selectedOption", selectedOption)
    if (selectedOption?.length === 0) {
      setIsShowQuantityError(true);
      return;
    }
    const param = {
      productName: values.productName,
      productPrice: values.price,
      description: values.description,
      productImage: imageKey,
      shopList: selectedProductShop,
      quantityType: selectedOption
    };

    console.log("+++++++++++++++++, param", param)

    createShopProduct(param);
    onCloseDrawer(event);
  };

  const onAddFile = async (acceptedFiles) => {
    setIsUploadingImage(true)
    const result = await ShopRepository.uploadToS3Image(acceptedFiles[0]);
    console.log("+++++++++++++++++++, result", result);
    if (result?.key) {
      setImageKey(result?.key)
    }
    setIsUploadingImage(false);
  };

  return (
    <div className={'add-client-wrapper'}>
      <div className="add-client-header-wrapper">
        <div className="add-client-header-Text">{isEdit ? "Edit Product Details" : "Add Product"}</div>
        <div
          className="add-client-header-title-Text">{isEdit ? "Change selected product’s details you want" : "Add a new product"}</div>
      </div>

      <div className={'add-client-wrapper-info'}>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object({
            productName: Yup.string()
              .required('Product name must be required')
          })}
          onSubmit={(values, {setSubmitting}) => {
            onPressSave(values);
          }}
        >
          <Form>
            <div style={{overflow: 'scroll', height: innerHeight - 270 }} className={'add-client-form-wrapper'}>
              <MyTextInput
                label="Product Name"
                name="productName"
                type="text"
                placeholder="Product Name"
              />
              <div style={{marginTop: '10px'}}>
                <label className={'add-client-value-Text'}>Quantity type</label>
                <div style={{marginTop: '10px'}}>
                  <Select
                    isMulti={true}
                    value={selectedOption}
                    onChange={(data) => {
                      console.log("+++++++++++++++++++++++++++, data", data)
                      setSelectedOption(data);
                      setIsShowQuantityError(false);
                    }}
                    options={options}
                    styles={customStyles}
                  />
                </div>
                {
                  isShowQuantityError ?
                    <div className={'add-client-value-error-Text'}>Quantity type is required</div>
                    : null
                }
              </div>
              <MyTextInput
                label="Description"
                name="description"
                type="text"
                placeholder="Description"
              />
              <MyTextInput
                label="Price"
                name="price"
                type="text"
                placeholder="Price"
              />
              <div className={'add-client-input-wrapper'} style={{marginBottom: '10px'}}>
                <label className={'add-client-value-Text'}>Product image</label>
              </div>
              {
                imageKey  ?
                  <div className="w-auto flex relative flex-row h-48 rounded-lg border-dashed border border-sky-500">
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
                      {({ getRootProps, getInputProps }: any) => (
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
            <div className="add-client-bottom-wrapper">
              <div className="add-client-btn-wrapper">
                <button className="add-client-save-btn" type="submit">{'Create product'}</button>
                <button className="add-client-discard-btn" onClick={(event) => onCloseDrawer(event)}>Discard</button>
              </div>
            </div>
          </Form>

        </Formik>
      </div>
    </div>
  );
};

export default connect(
  state => ({
    selectedProductShop: state.shop.get('selectedProductShop'),

  }),
  ({
    createShopProduct: Actions.shop.createShopProduct,
    updateClient: Actions.client.updateClient,
  }),
)(AddProductView);

const options = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'bottle', label: 'bottle' },
  { value: 'pieces', label: 'pieces' },
  { value: 'items', label: 'items' },
  { value: 'liter', label: 'liter' },
  { value: 'packets', label: 'packets' }
];

const customStyles = {
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

