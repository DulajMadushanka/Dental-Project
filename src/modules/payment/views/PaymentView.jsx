import React, {useEffect, useState} from 'react';
import '../../../components/Transaction/transaction-component.css';
import axios from 'axios';
import MasterCard from '../../../assets/svgs/masterCardIcon.svg';
import VisaCard from '../../../assets/svgs/visaCardIcon.svg';
import CreditCardIcon from '../../../assets/svgs/creditCardIcon.svg';
import {CircularProgress} from "@material-ui/core";


const PaymentView = (props) => {
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

  console.log("++++++++++++++++++, orderId orderId", orderId)

  useEffect(() => {
    getPaymentToken();
  }, [])

  const getPaymentToken = () => {
    setIsLoadingAction(true);
    axios.post('https://uvpx3iy89e.execute-api.ap-southeast-1.amazonaws.com/dev/order-details', {
      orderId: orderId
    })
      .then(function (response:any) {
        setPaymentToken(response?.data?.orderResult?.payment);
        setCustomFields(response?.data?.orderResult?.customFields);
        setTotalAmount(response?.data?.orderResult?.totalPrice);
        setDeliveryCharges(response?.data?.orderResult?.deliveryCharge);
        setSubTotal(parseFloat(response?.data?.orderResult?.amount));
        setLastName(response?.data?.orderResult?.user?.lastName ? response?.data?.orderResult?.user?.lastName : response?.data?.orderResult?.user?.firstName);
        setFirstName(response?.data?.orderResult?.user?.firstName);
        setEmail(response?.data?.orderResult?.user?.email);
        setSecretKey(response?.data?.orderResult?.secretKey);
        setPhoneNumber(response?.data?.orderResult?.user?.phoneNumber ? response?.data?.orderResult?.user?.phoneNumber : "+94711111111");
        setIsLoadingAction(false)
      })
      .catch(function (error) {
        console.log(error);
        setIsLoadingAction(false)
      });
  };

  return (
    <div style={{backgroundImage: `linear-gradient(to bottom, #FFFFFF, #FFFFFF)`, backgroundColor: 'red', height: window.innerHeight, paddingLeft: '30px', paddingRight: '30px'}}>
      <div style={{fontSize: '18px', color: '#000000', fontWeight: '500'}}>
        Credit/Debit Card
      </div>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '20px'}}>
        <div>
          <img src={VisaCard} />
        </div>
        <div style={{marginLeft: '10px'}}>
          <img src={MasterCard} />
        </div>
      </div>
      <div style={{marginTop: '-30px'}}>
        <img src={CreditCardIcon}/>
      </div>
      <div style={{marginBottom: '50px'}}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '-25px', justifyContent: 'space-between'}}>
          <div style={{fontSize: '17px', color: '#413E36', fontWeight: '500'}}>
            Subtotal
          </div>
          <div style={{fontSize: '17px', color: '#413E36', fontWeight: '500'}}>
            Rs. {subTotal.toFixed(2)}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '15px', justifyContent: 'space-between'}}>
          <div style={{fontSize: '17px', color: '#413E36', fontWeight: '500'}}>
            Delivery charges
          </div>
          <div style={{fontSize: '17px', color: '#413E36', fontWeight: '500'}}>
            Rs. {deliveryCharges.toFixed(2)}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: '15px', justifyContent: 'space-between'}}>
          <div style={{fontSize: '17px', color: '#413E36', fontWeight: 600}}>
            Total Amount
          </div>
          <div style={{fontSize: '17px', color: 'red', fontWeight: 600}}>
            Rs. {totalAmount.toFixed(2)}
          </div>
        </div>
        {
          isLoadingAction ?
            <div style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '100%', top: '70px'}}>
              <CircularProgress
                size={35}
                style={{ color: "blue", marginRight: '40px', marginLeft: '10px'}}
              />
            </div>
            : null
        }
      </div>
      <form action="https://stagingxpay.info/index.php?route=checkout/billing" method="POST">
        <input type="hidden" name="first_name" value={firstName} />
        <input type="hidden" name="last_name" value={lastName} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="contact_number" value={phoneNumber} />
        <input type="hidden" name="address_line_one" value="Hakmana" />
        <input type="hidden" name="country" value="LK" />
          <input type="hidden" name="postal_code" value="81300" />
            <input type="hidden" name="city" value="hakmana" />
        <input type="hidden" name="address_line_two" value="matara" />
        <input type="hidden" name="cms" value="PHP" />
        <input type="hidden" name="process_currency" value="LKR" />
        <input type="hidden" name="custom_fields" value={customFields} />
        <input type="hidden" name="enc_method" value="JCs3J+6oSz4V0LgE0zi/Bg==" />
          <input type="hidden" name="secret_key" value={secretKey} />
            <input type="hidden" name="payment" value={paymentToken} />

        {
          !isLoadingAction && paymentToken ?
            <div onClick={()=> setIsLoading(true)} style={{height: '55px', backgroundImage: `linear-gradient(to bottom, #69FE34, #03AE00)`, borderRadius: '15px', color: '#FFFFFF'}}>
              <button style={{ width: window.innerWidth - 60, height: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} type="submit" value="Pay Now">
                <div style={{color: '#FFFFFF',}}>
                  Pay Now
                </div>
                {
                  isLoading ?
                    <div style={{position: 'absolute', right: '50px'}}>
                      <CircularProgress
                        size={25}
                        style={{ color: "#EFF0F8", marginRight: '40px', marginLeft: '10px'}}
                      />
                    </div>
                    : null
                }
              </button>
            </div>
            : null
        }

              </form>
    </div>
  );
};

export default PaymentView;

