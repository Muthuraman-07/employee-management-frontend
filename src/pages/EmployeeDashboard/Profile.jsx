import React, { useState, useEffect } from "react";
import {api} from "../../service/api"; // Using API instance
import "./Profile.css"; // Import CSS

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username"); 

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`employee/employee-username/${username}`);
        setEmployee(response.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Failed to load employee details. Please try again.");
      }
    };

    if (username) {
      fetchEmployeeData();
    }
  }, [username]);

  return (
    <div className="profile-container">
      <h2 className="profile-title">Employee Profile</h2>

      {error && <p className="error-message">{error}</p>}

      {employee ? (
        <div className="profile-card">
          <div className="profile-details">
            <div className="detail"><strong>Employee ID:</strong> {employee.employeeId}</div>
            <div className="detail"><strong>Manager ID:</strong> {employee.managerId}</div>
            <div className="detail"><strong>Email:</strong> {employee.email}</div>
            <div className="detail"><strong>Phone Number:</strong> {employee.phoneNumber}</div>
            <div className="detail"><strong>Department:</strong> {employee.department}</div>
            <div className="detail"><strong>Shift ID:</strong> {employee.shiftId}</div>
            <div className="detail"><strong>Joined Date:</strong> {employee.joinedDate}</div>
          </div>
        </div>
      ) : (
        !error && <p className="loading-message">Loading employee details...</p>
      )}
    </div>
  );
};

export default Profile;
