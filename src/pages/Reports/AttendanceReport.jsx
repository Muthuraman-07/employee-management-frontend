import React, { useState } from 'react';
import { api } from '../../service/api';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const AttendanceReports = () => {
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('');
  const [employee, setEmployee] = useState('');
  const [reportData, setReportData] = useState([]);

  const generateReport = async () => {
    try {
      let response;

      if (reportType === 'all') {
        response = await api.get(`attendance/all-records`);
      } else if (reportType === 'date') {
        response = await api.get(`attendance/by-date?range=${dateRange}`);
      } else if (reportType === 'employee') {
        response = await api.get(`attendance/employee/${employee}`);
      }

      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Attendance Reports</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Report Type</label>
          <select
            className="form-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="all">All Employees</option>
            <option value="date">By Date Range</option>
            <option value="employee">By Employee ID</option>
          </select>
        </div>

        {reportType === 'date' && (
          <div className="col-md-4">
            <label className="form-label">Date Range</label>
            <input
              type="text"
              className="form-control"
              placeholder="YYYY-MM-DD to YYYY-MM-DD"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
        )}

        {reportType === 'employee' && (
          <div className="col-md-4">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              className="form-control"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={generateReport}>
          Generate Report
        </button>
        <button className="btn btn-primary me-2" onClick={() => exportToPDF('attendanceReport')}>
          Export to PDF
        </button>
        <button className="btn btn-primary me-2" onClick={() => exportToExcel('attendanceReport')}>
          Export to Excel
        </button>
      </div>

      <div className="table-responsive">
        <table id="attendanceReport" className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Attendance ID</th>
              <th>Employee ID</th>
              <th>Is Present</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Work Hours</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.attendanceID}</td>
                <td>{item.employeeId}</td>
                <td>{item.isPresent ? 'Yes' : 'No'}</td>
                <td>{new Date(item.clockInTime).toLocaleTimeString()}</td>
                <td>{new Date(item.clockOutTime).toLocaleTimeString()}</td>
                <td>{item.workHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReports;
