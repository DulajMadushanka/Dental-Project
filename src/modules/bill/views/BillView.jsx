import React, {useEffect, useState} from 'react';
import '../../../components/Transaction/transaction-component.css';
import axios from 'axios';
import MasterCard from '../../../assets/svgs/masterCardIcon.svg';
import VisaCard from '../../../assets/svgs/visaCardIcon.svg';
import CreditCardIcon from '../../../assets/svgs/creditCardIcon.svg';
import {CircularProgress} from "@material-ui/core";
import ReactPanZoom from 'react-image-pan-zoom-rotate';


const BillView = (props) => {
  const [paymentToken, setPaymentToken] = useState("");
  const [customFields, setCustomFields] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const orderId = params.get('orderId');

  return (
    <div style={{height: window.innerHeight, width: window.innerWidth}}>
      <ReactPanZoom
        width={200}
        image="https://images.unsplash.com/photo-1551091708-fda32ed3178c"
        alt="Image alt text"
      />
    </div>
  );
};

export default BillView;

