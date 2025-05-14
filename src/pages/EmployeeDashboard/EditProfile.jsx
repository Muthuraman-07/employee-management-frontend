import React, { useState, useEffect } from "react";
import { api } from "../../service/api"; // API instance
import { useNavigate } from "react-router-dom"; // Navigation for redirect
// import "./EditProfile.css"; // Import CSS

const EditProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [updatedEmployee, setUpdatedEmployee] = useState({});
  const [error, setError] = useState("");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`employee/employee-username/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Added JWT Token
          },
        });
        setEmployee(response.data);
        setUpdatedEmployee({
          firstName: response.data.firstName,
          username: response.data.username,
          password: "",
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
        });
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError(err.response?.data || "Failed to load employee details. Please try again.");
      }
    };

    if (username) {
      fetchEmployeeData();
    }
  }, [username]);

  // ✅ Handle Input Change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedEmployee({ ...updatedEmployee, [name]: value });
  };

  // ✅ Handle Profile Update via PATCH Request
  const handleUpdateProfile = async () => {
    try {
      if (!employee) {
        alert("Error: Employee data is unavailable.");
        return;
      }

      await api.patch(`employee/update/employee-record/${employee.employeeId}`, updatedEmployee, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // ✅ Ensure JWT Token is sent
          "Content-Type": "application/json",
        },
      });

      alert("Profile updated successfully!");
      navigate("/profile"); // ✅ Redirect back to profile after update
    } catch (err) {
      console.error("Error updating employee profile:", err);
      setError(err.response?.data || "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-title">Edit Profile</h2>

      {error && <p className="error-message">{error}</p>}

      {employee ? (
        <div className="edit-profile-card">
          <div className="edit-profile-details">
            <div className="detail">
              <strong>First Name:</strong>
              <input
                type="text"
                name="firstName"
                value={updatedEmployee.firstName || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="detail">
              <strong>Username:</strong>
              <input
                type="text"
                name="username"
                value={updatedEmployee.username || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="detail">
              <strong>Password:</strong>
              <input
                type="password"
                name="password"
                value={updatedEmployee.password || ""}
                onChange={handleInputChange}
                placeholder="Enter new password"
              />
            </div>
            <div className="detail">
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={updatedEmployee.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="detail">
              <strong>Phone Number:</strong>
              <input
                type="text"
                name="phoneNumber"
                value={updatedEmployee.phoneNumber || ""}
                onChange={handleInputChange}
              />
            </div>
            <button className="btn btn-success" onClick={handleUpdateProfile}>
              Save Changes ✅
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/profile")}>
              Cancel ❌
            </button>
          </div>
        </div>
      ) : (
        !error && <p className="loading-message">Loading employee details...</p>
      )}
    </div>
  );
};

export default EditProfile;
