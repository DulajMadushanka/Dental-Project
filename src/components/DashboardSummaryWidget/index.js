import React from 'react';
import { Container, Row, Col } from 'react-grid-system';
import './dashboard-summary-widget.css';
import AnalyticsPrecentageWidget from '../AnalyticsPrecentageWidget';
import H1 from '../H1';
import H5 from '../H5';

const DashboardSummaryWidget = ({ selectedSalon, dayReportSummary }) => {
  const currency = selectedSalon?.currency;

  if (!selectedSalon) {
    return <div />;
  }

  const mapSummaryList = []

  return (
    <div>
      <Row>
        {mapSummaryList.map(summary => (
          <Col sm={3}>
            <div className="dash-board-widget-container">
              <H5 regular>{summary.name}</H5>
              <div className="dash-board-widget-amount-container">
                <H1>
                  10
                </H1>
                {
                  <AnalyticsPrecentageWidget
                    growth={{}}
                    summaryType={""}
                  />
                }
              </div>
              <div className="dashboard-item-count">
                100
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardSummaryWidget;
