import React from 'react';
import '../../../components/Transaction/transaction-component.css';
import {CircularProgress} from "@material-ui/core";


const SuccessView = () => {
  return (
    <div>
      <div style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '100%', top: '70px'}}>
        <CircularProgress
          size={35}
          style={{ color: "blue", marginRight: '40px', marginLeft: '10px'}}
        />
      </div>
    </div>
  );
};

export default SuccessView;

