import React, {useRef} from "react";
import { connect } from "react-redux";
import Table from "react-table-lite";
import './Style.css'

export const DashboardView = ({todaySummary, lastWeekSummary}) => {
    const customDownloadButtonRef = useRef(null)
    const customSearchFormRef = useRef(null)

    console.log("+++++++++++++++++++++, lastWeekSummary", lastWeekSummary)

  return (
      <div className="dashboard-view-container">
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <div className="row account-info d-flex flex-column mr-7 mb-4 py-5"
                   style={{width: '230px', padding: '15px'}}>
                  <div className="col justify-content-between align-items-center">
                  <span>
                    <div className="my-account-item-desc" style={{fontSize: '16px'}}>Today Income</div>
                      <div className="my-account-item mt-2" style={{fontSize: '22px'}}>Rs {todaySummary?.totalPrice > 0 ? todaySummary?.totalPrice?.toFixed(2) : "0.00" }</div>
                  </span>
                  </div>
              </div>
              <div className="row account-info d-flex flex-column mr-7 mb-4 py-5"
                   style={{width: '230px', padding: '15px'}}>
                  <div className="col justify-content-between align-items-center">
                  <span>
                    <div className="my-account-item-desc" style={{fontSize: '16px'}}>Last Week Income</div>
                      <div className="my-account-item mt-2" style={{fontSize: '22px'}}>Rs {lastWeekSummary?.totalPrice > 0 ? lastWeekSummary?.totalPrice?.toFixed(2) : "0.00" }</div>
                  </span>
                  </div>
              </div>
          </div>
          <div style={{marginTop: '20px'}}>
              <div className="my-account-item-desc"
                   style={{fontSize: '18px', marginBottom: "20px", fontWeight: '700'}}>Today New Patients
              </div>
              {
                todaySummary?.mapPatients?.length > 0 ?
                    <Table
                        data={todaySummary?.mapPatients?.length > 0 ? todaySummary?.mapPatients : []}
                        headers={["Name", "Phone Number", "Email", "Age", "Address"]}
                        noDataMessage={"No new patients found"}
                        showActions={false}
                        showPagination={false}
                        totalPages={100}
                        currentPage={1}
                        showNumberofPages={10}
                        showPerPageLimitOptions={false}
                        currentPerPageLimit={100}
                        actionTypes={["edit", "delete", "view"]}
                        showMultiSelect={false}
                        checkedKey={"selected"}
                        disableCheckedKey={"selectDisabled"}
                        perPageLimitOptions={[10, 30, 50, 100]}
                        containerStyle={{}}
                        tableStyle={{}}
                        headerStyle={{fontWeight: '500', color: 'gray', fontSize: '16px'}}
                        // Customize table header style
                        rowStyle={{fontWeight: '400', color: 'black', fontSize: '14px'}}
                        // Customize table row style
                        cellStyle={{}}
                        // Customize table data cell style
                        customRenderCell={{
                            Name: (row) => (
                                <div>
                                    <div className='custom-class'> {row.Name} </div>
                                </div>
                            )
                        }}
                        onSort={(event, data, sortedBy, direction) => {

                        }}
                        onRowSelect={(args, event, row) => {

                        }}
                        onAllRowSelect={(args, event, allrows) => {

                        }}
                        onRowDelete={(args, event, row) => {

                        }}
                        onRowEdit={(args, event, row) => {

                        }}
                        onRowView={(args, event, row) => {

                        }}
                        onDownload={(event) => {

                        }}
                        onPaginate={(args, event, currentPage) => {

                        }}
                        onPerPageLimitSelect={(args, event, limit) => {

                        }}
                    />
                    :
                    <div style={{textAlign: 'center', fontSize: '16px', marginTop: '50px', marginBottom: '100px'}}>
                        No new patient found
                    </div>
              }
              
          </div>
          <div style={{marginTop: '20px'}}>
              <div className="my-account-item-desc"
                   style={{fontSize: '18px', marginBottom: "20px", fontWeight: '700'}}>Today Patient Treatments
              </div>
              {
                todaySummary?.mapPatientTreatments?.length > 0 ?
                    <Table
                        data={todaySummary?.mapPatientTreatments?.length > 0 ? todaySummary?.mapPatientTreatments : []}
                        headers={["Name", "Phone Number", "Amount", "Date", "Address"]}
                        noDataMessage={"No new patient treatments found"}
                        showActions={false}
                        showPagination={false}
                        totalPages={100}
                        currentPage={1}
                        showNumberofPages={10}
                        showPerPageLimitOptions={false}
                        currentPerPageLimit={100}
                        actionTypes={["edit", "delete", "view"]}
                        showMultiSelect={false}
                        checkedKey={"selected"}
                        disableCheckedKey={"selectDisabled"}
                        perPageLimitOptions={[10, 30, 50, 100]}
                        containerStyle={{}}
                        tableStyle={{}}
                        headerStyle={{fontWeight: '500', color: 'gray', fontSize: '16px'}}
                        // Customize table header style
                        rowStyle={{fontWeight: '400', color: 'black', fontSize: '14px'}}
                        // Customize table row style
                        cellStyle={{}}
                        // Customize table data cell style
                        customRenderCell={{
                            Name: (row) => (
                                <div>
                                    <div className='custom-class'> {row.Name} </div>
                                </div>
                            )
                        }}
                        onSort={(event, data, sortedBy, direction) => {

                        }}
                        onRowSelect={(args, event, row) => {

                        }}
                        onAllRowSelect={(args, event, allrows) => {

                        }}
                        onRowDelete={(args, event, row) => {

                        }}
                        onRowEdit={(args, event, row) => {

                        }}
                        onRowView={(args, event, row) => {

                        }}
                        onDownload={(event) => {

                        }}
                        onPaginate={(args, event, currentPage) => {

                        }}
                        onPerPageLimitSelect={(args, event, limit) => {

                        }}
                    />
                    :
                    <div style={{textAlign: 'center', fontSize: '16px', marginTop: '50px'}}>
                        No new patient treatments found
                    </div>
              }
             
              
          </div>
      </div>
  );
};

export default connect(
  (state: any) => ({
    todaySummary: state.dashboard.get("todaySummary"),
    lastWeekSummary: state.dashboard.get("lastWeekSummary"),
  }),
  {
    
  }
)(DashboardView);
