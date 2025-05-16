import React, { useState, useEffect } from "react";
import { api } from "../../service/api"; // API instance
import "./ViewEmployee.css"; // Import CSS

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username"); // ✅ Get username from local storage

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
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

    if (username) {
      fetchEmployeeId();
    }
  }, [username]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get(`employee/get/all-employee-records/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Include JWT Token
          },
        });

        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Failed to load employee details. Please try again.");
      }
    };

    if (employeeId) {
      fetchEmployees();
    }
  }, [employeeId]);

  return (
    <div className="employees-container">
      <h2 className="employees-title">View Employees</h2>

      {error && <p className="error-message">{error}</p>}

      {employees.length > 0 ? (
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Manager ID</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Department</th>
              <th>Shift ID</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employeeId}>
                <td>{employee.employeeId}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.managerId}</td>
                <td>{employee.email}</td>
                <td>{employee.phoneNumber}</td>
                <td>{employee.department}</td>
                <td>{employee.shiftId}</td>
                <td>{employee.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p className="loading-message">Loading employee details...</p>
      )}
    </div>
  );
};

export default ViewEmployee;
