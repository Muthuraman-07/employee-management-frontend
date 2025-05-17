import React, { useState, useEffect } from "react";
import { api } from "../../service/api"; // Using API instance for backend communication
import { useNavigate } from "react-router-dom"; 
import "./Profile.css"; // Import CSS for styling

const Profile = () => {
  // State to store employee details
  const [employee, setEmployee] = useState(null);

  // Error state to handle API failures
  const [error, setError] = useState("");

  // Fetch the username from local storage
  const username = localStorage.getItem("username");

  // Initialize navigation for redirection
  const navigate = useNavigate();

  // Fetch employee data when the component mounts
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // API request to fetch employee details using username
        const response = await api.get(`employee/employee-username/${username}`);
        setEmployee(response.data);
      } catch (err) {
        console.error("Error fetching employee details:", err.response?.data || err.message);
        setError("Failed to load employee details. Please try again.");
      }
    };

    // Ensure username exists before making API call
    if (username) {
      fetchEmployeeData();
    }
  }, [username]);

  return (
    <div className="profile-container">
      <h2 className="profile-title">Employee Profile</h2>

      {/* Display error message if the API request fails */}
      {error && <p className="error-message">{error}</p>}

      {/* Render employee details if successfully fetched */}
      {employee ? (
        <div className="profile-card">
          <div className="profile-details">
            <div className="detail"><strong>Employee ID:</strong> {employee.employeeId}</div>
            <div className="detail"><strong>Manager ID:</strong> {employee.managerId}</div>
            <div className="detail"><strong>Username:</strong> {employee.username}</div>
            <div className="detail"><strong>First Name:</strong> {employee.firstName}</div>
            <div className="detail"><strong>Last Name:</strong> {employee.lastName}</div>
            <div className="detail"><strong>Role:</strong> {employee.role ? employee.role.substring(5) : ""}</div>
            <div className="detail"><strong>Email:</strong> {employee.email}</div>
            <div className="detail"><strong>Phone Number:</strong> {employee.phoneNumber}</div>
            <div className="detail"><strong>Department:</strong> {employee.department}</div>
            <div className="detail"><strong>Shift ID:</strong> {employee.shiftId}</div>
            <div className="detail"><strong>Joined Date:</strong> {employee.joinedDate}</div>
          </div>

          {/* Button to navigate to the Edit Profile page */}
          <button className="btn btn-primary edit-button" onClick={() => navigate("/edit-profile")}>
            Edit Profile ✏️
          </button>
        </div>
      ) : (
        // Display loading message if employee data is still being fetched
        !error && <p className="loading-message">Loading employee details...</p>
      )}
    </div>
  );
};

export default Profile;
