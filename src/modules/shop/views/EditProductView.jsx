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

export const EditProductView = props => {
  const {product, status, onCloseDrawer, onChangeProduct, updateClient, createClient, createShopProduct, selectedProductShop} = props;
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
  const [isUpdate, setIsUpdate] = useState(false);
  const [imageKey, setImageKey] = useState('');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isShowQuantityError, setIsShowQuantityError] = useState(false);

  useEffect(() => {
    const findItem = _.find(options, option => option?.value === product?.quantityType);
    console.log("++++++++++++++++++++, product product", product)
    setProductName(_.get(product, 'productName', ''));
    setDescription(_.get(product, 'description', ''));
    setProductPrice(_.get(product, 'productPrice', ''));
    setImageKey(_.get(product, 'productImage', ''));
    setSelectedOption(product?.quantityType);
  }, [product]);

  const onPressSave = (values, event) => {
    console.log("++++++++++++++++++++, values", values)
    const param = {
      productName: values.productName,
      quantityType: values.quantityType,
      productImage: imageKey,
      shopList: selectedProductShop
    };

    createShopProduct(param);
    onCloseDrawer(event);
  };

  const onAddFile = async (acceptedFiles: any, type: string) => {
    setIsUploadingImage(true);
    const result = await ShopRepository.uploadToS3Image(acceptedFiles[0]);
    console.log("+++++++++++++++++++, result", result);
    if (result?.key) {
      setImageKey(result?.key)
    }
    setIsUploadingImage(false);
  };

  console.log("++++++++++++++++++++++++++, selectedOption", selectedOption)

  return (
    <div className={'add-client-wrapper'}>
      <div className="add-client-header-wrapper">
        <div className="add-client-header-Text">{"Edit Product Details"}</div>
        <div
          className="add-client-header-title-Text">{"Change selected product’s details you want"}</div>
      </div>

      <div className={'add-client-wrapper-info'} style={{overflow: 'scroll', height: innerHeight - 240 }}>
        <div className={'add-client-form-wrapper'}>
          <div className={'add-client-input-wrapper'}>
            <label className={'add-client-value-Text'}>Product Name</label>
            <input onChange={(event) => setProductName(event.target.value)} value={productName} className={'add-client-input'} />
          </div>
          <div style={{marginTop: '10px'}}>
            <label className={'add-client-value-Text'}>Quantity type</label>
            <div style={{marginTop: '10px'}}>
              <Select
                isMulti={true}
                value={selectedOption}
                onChange={(data) => {
                  console.log("+++++++++++++++++++++++++++, data", data)
                  setIsShowQuantityError(false);
                  setSelectedOption(data);
                }}
                options={options}
                styles={customStyles}
              />
              {
                isShowQuantityError ?
                  <div className={'add-client-value-error-Text'}>Quantity type is required</div>
                  : null
              }
            </div>
          </div>
          <div className={'add-client-input-wrapper'}>
            <label className={'add-client-value-Text'}>Description</label>
            <input onChange={(event) => setDescription(event.target.value)} value={description} className={'add-client-input'} />
          </div>
          <div className={'add-client-input-wrapper'}>
            <label className={'add-client-value-Text'}>Product Price</label>
            <input onChange={(event) => setProductPrice(event.target.value)} value={productPrice} className={'add-client-input'} />
          </div>
          <div className={'add-client-input-wrapper'} style={{marginBottom: '10px'}}>
            <label className={'add-client-value-Text'}>Product Image</label>
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
            <button onClick={(event) => {
              if (selectedOption?.length === 0) {
                setIsShowQuantityError(true);
                return;
              }
              console.log("+++++++++++++++++++++++++++, selectedOption----------", selectedOption)
              onChangeProduct({productName, description, productPrice, productId: product.productId, productImage: imageKey, quantityType: selectedOption});
              onCloseDrawer(event);
            }} className="add-client-save-btn" type="submit">{'Update product'}</button>
            <button className="add-client-discard-btn" onClick={(event) => onCloseDrawer(event)}>Discard</button>
          </div>
        </div>
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
)(EditProductView);

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
