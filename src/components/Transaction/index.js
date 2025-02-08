import './transaction-component.css';
import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import BlueDownIcon from '../../images/downBlueIcon.svg';
import GrayDownIcon from '../../images/downGrayIcon.svg';
import FilterDropDown from '../FilterDropDown';
import TableView from '../Table';
import SearchBox from '../SearchBox';

const TransactionView = () => (
  <div>
    <div className="customers-text">Transactions</div>
    <div>
      <Row className="transaction-topbar-container">
        <Col sm={4} md={4}>
          <SearchBox />
        </Col>
        <Col sm={2} md={2}>
          <FilterDropDown
            text="Appointments"
            width="180px"
            border="1px solid #086BEF"
            backgroundColor="#E8F7FF"
            selectedValue="All"
            textColor="#898989"
            itemList={[
              {
                title: 'All',
                value: 'All',
              },
              {
                title: 'Service',
                value: 'Service',
              },
              {
                title: 'Product',
                value: 'Product',
              },
            ]}
          />
        </Col>
        <Col sm={2} md={2}>
          <FilterDropDown
            text="Employee"
            width="180px"
            border="1px solid #E3E3E3"
            backgroundColor="#F8F9FB"
            justifyContent="center"
            textColor="#5A6F7C"
            itemList={[
              {
                title: 'Dulaj',
                value: 'Dulaj',
              },
              {
                title: 'Nilusha',
                value: 'Nilusha',
              },
            ]}
          />
        </Col>
        <Col sm={2} md={2}>
          <FilterDropDown
            text="Customer"
            width="180px"
            border="1px solid #E3E3E3"
            backgroundColor="#F8F9FB"
            textColor="#5A6F7C"
            itemList={[
              {
                title: 'Dulaj',
                value: 'Dulaj',
              },
              {
                title: 'Nilusha',
                value: 'Nilusha',
              },
            ]}
          />
        </Col>
        <Col sm={2} md={2} />
      </Row>
    </div>
    <div style={{ marginTop: '30px' }}>
      <TableView />
    </div>
  </div>
);

export default TransactionView;
