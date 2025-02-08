import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import './analytics-precentage-widget.css';

const AnalyticsPrecentageWidget = ({ type, growth, summaryType }) => (
  <div>
    <Container>
      <Row>
        <Col sm={4}>
          <div
            className={`dash-board-analytics-widget`}
            style={{
              backgroundColor:
                '#6D71F9',
            }}
          >
            <div className="dash-board-analytics-widget-text">
              +10 %
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </div>
);

export default AnalyticsPrecentageWidget;
