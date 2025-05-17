import React, { useState } from "react";
import { api } from "../../service/api";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";
import "bootstrap/dist/css/bootstrap.min.css";

const AttendanceReports = () => {
  const [reportType, setReportType] = useState("all");
  const [employee, setEmployee] = useState("");
  const [reportData, setReportData] = useState([]);
  const [showHeaders, setShowHeaders] = useState(false); // ✅ Track header visibility

  const generateReport = async () => {
    try {
      let response;

      if (reportType === "all") {
        response = await api.get(`attendance/all-records`);
      } else if (reportType === "employee") {
        response = await api.get(`attendance/all-records/${employee}`);
      }

      setReportData(response.data);
      setShowHeaders(true); // ✅ Show table headers only after clicking "Generate Report"
    } catch (error) {
      console.error("Error generating report:", error);
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
            <option value="employee">By Employee ID</option>
          </select>
        </div>

        {reportType === "employee" && (
          <div className="col-md-4">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              className="form-control"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="Enter Employee ID"
            />
          </div>
        )}
      </div>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={generateReport}>
          Generate Report
        </button>
        <button className="btn btn-primary me-2" onClick={() => exportToPDF("attendanceReport")}>
          Export to PDF
        </button>
        <button className="btn btn-primary me-2" onClick={() => exportToExcel("attendanceReport")}>
          Export to Excel
        </button>
      </div>

      <div className="table-responsive">
        <table id="attendanceReport" className="table table-bordered table-striped">
          {showHeaders && ( // ✅ Show headers **only** after clicking "Generate Report"
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
          )}
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.attendanceID}</td>
                <td>{item.employeeId}</td>
                <td>{item.isPresent ? "Yes" : "No"}</td>
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
