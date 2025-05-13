import React, { useState } from 'react';
import { api } from '../../service/api';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
const EmployeeReports = () => {
  const [employeeData, setEmployeeData] = useState([]);

  const generateEmployeeReport = async () => {
    try {
      const response = await api.get('employee/get/all-employee-records'); // Adjust endpoint
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  return (
    <div className="container mt-5" style={{ minWidth: '100vh' }}>
      <h2 className="mb-4" style={{scrollMarginTop: '100px', paddingTop : '1rem'}}>Employee Reports</h2>

      <div className="mb-5 d-flex justify-content-center align-items-center flex-wrap gap-2">
        <button className="btn btn-primary me-2 text-nowrap" onClick={generateEmployeeReport}>
          Generate Report
        </button>
        <button className="btn btn-primary me-2 text-nowrap" onClick={() => exportToPDF('employeeReport')}>
          Export to PDF
        </button>
        <button className="btn btn-primary me-2 text-nowrap" onClick={() => exportToExcel('employeeReport')}>
          Export to Excel
        </button>
      </div>

      <div className="table-responsive">
        <table id="employeeReport" className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Employee ID</th>
              <th>FirstName</th>
              <th>LastName</th>
              <th>Department</th>
              <th>Role</th>
              <th>Email</th>
              <th>PhoneNumber</th>
              <th>ManagerId</th>
              <th>ShiftId</th>
              <th>JoinedDate</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((emp, index) => (
              <tr key={index}>
                <td>{emp.employeeId}</td>
                <td>{emp.firstName}</td>
                <td>{emp.lastName}</td>
                <td>{emp.department}</td>
                <td>{emp.role}</td>
                <td>{emp.email}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.managerId}</td>
                <td>{emp.shiftId}</td>
                <td>{emp.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeReports;
