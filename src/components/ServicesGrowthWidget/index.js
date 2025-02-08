import React from 'react';
import { Row, Col } from 'react-grid-system';
import { Container, ChartWrapper } from './services-growth-widget';
import H2 from '../H2';
import SUBTITLE from '../Subtitle';
import './service-growth.css';

const ServicesGrowthWidget = ({
  reportsSummary,
  selectedShop,
  allDayOrderList,
}) => {
  const { labelList, dataList } = [];
  const backgroundColor = [
    'rgb(109, 113, 249)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)',
    'rgb(53, 228, 175)',
    'rgb(255, 99, 132)',
  ];
  const currency = selectedShop?.currency || 'USD';

  return (
    <div className="chart-container">
      <Row>
        <Col sm={6}>
          <Container>
            <H2>Today</H2>
            <Row>
              <Col sm={12}>
                <SUBTITLE>Sales by hour</SUBTITLE>
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
              </Col>
            </Row>
          </Container>
        </Col>
        <Col sm={6}>
          <Container>
            <H2>Today services</H2>
            <Row>
              <Col sm={12}>
                <SUBTITLE>Top 5 services</SUBTITLE>
              </Col>
            </Row>
            <Row>
              <Col sm={6} className="pie-chart-container">
              </Col>
              <Col sm={6} className="pie-chart-right-side-container">
                <div>
                  {labelList.map((label, index) => (
                    <Row className="pie-chart-right-side-row">
                      <Col
                        sm={1}
                        className="pie-chart-right-side-dot-container"
                      >
                        <div
                          className="pie-chart-right-side-dot"
                          style={{ backgroundColor: backgroundColor[index] }}
                        />
                      </Col>
                      <Col
                        sm={9}
                        className="pie-chart-right-side-label-container"
                      >
                        <div className="pie-chart-right-side-label">
                          100
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
};

export default ServicesGrowthWidget;
