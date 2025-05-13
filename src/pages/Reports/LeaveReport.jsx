import React, { useState } from 'react';
import { api } from '../../service/api';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const LeaveReports = () => {
  const [leaveData, setLeaveData] = useState([]);

  const generateLeaveReport = async () => {
    try {
      const response = await api.get('leaveBalance/all-employee-leave-balances'); // Adjust endpoint as needed
      setLeaveData(response.data);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  return (
    <div className="container mt-4 px-4" style={{ minWidth: '100vh' }}>
      <h2 className="mb-4">Leave Balance Report</h2>

      <div className="mb-5 d-flex justify-content-center align-items-center flex-wrap gap-2">
        <button className="btn btn-primary me-2" onClick={generateLeaveReport}>
          Generate Report
        </button>
        <button className="btn btn-primary me-2" onClick={() => exportToPDF('leaveReport')}>
          Export to PDF
        </button>
        <button className="btn btn-primary me-2" onClick={() => exportToExcel('leaveReport')}>
          Export to Excel
        </button>
      </div>

      <div className="table-responsive">
        <table id="leaveReport" className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Leave Type</th>
              <th>Remaining Leaves</th>
              <th>Used Leaves</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((leave, index) => (
              <tr key={index}>
                <td>{leave.employeeId}</td>
                <td>{leave.name}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.remainingLeaves}</td>
                <td>{leave.originalLeaves - leave.remainingLeaves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveReports;
