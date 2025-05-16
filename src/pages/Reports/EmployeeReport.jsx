import React, { useState, useEffect } from "react";
import { api } from "../../service/api";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";

const EmployeeReports = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username"); // ✅ Retrieve username from local storage

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        if (!username) throw new Error("No username found in local storage.");

        const response = await api.get(`employee/employee-username/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Include JWT Token
          },
        });

        setEmployeeId(response.data.employeeId); // ✅ Extract Employee ID
      } catch (err) {
        console.error("Error fetching employee ID:", err);
        setError("Failed to retrieve employee ID.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  const fetchEmployeeReports = async () => {
    try {
      if (!employeeId) throw new Error("Employee ID not available yet.");

      const response = await api.get(`employee/get/all-employee-records/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Include JWT Token
        },
      });

      setEmployeeData(response.data);
    } catch (err) {
      console.error("Error fetching employee reports:", err);
      setError("Failed to load employee reports. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ minWidth: "100vh" }}>
      <h2 className="mb-4" style={{ scrollMarginTop: "100px", paddingTop: "1rem" }}>
        Employee Reports
      </h2>

      <div className="mb-5 d-flex justify-content-center align-items-center flex-wrap gap-2">
        <button className="btn btn-primary me-2 text-nowrap" onClick={fetchEmployeeReports}>
          Generate Report
        </button>
        <button className="btn btn-primary me-2 text-nowrap" onClick={() => exportToPDF("employeeReport")}>
          Export to PDF
        </button>
        <button className="btn btn-primary me-2 text-nowrap" onClick={() => exportToExcel("employeeReport")}>
          Export to Excel
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="table-responsive">
        <table id="employeeReport" className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Manager ID</th>
              <th>Shift ID</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.map((emp) => (
              <tr key={emp.employeeId}>
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
