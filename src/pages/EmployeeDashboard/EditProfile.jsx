import React, { useState, useEffect } from "react";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "./EditProfile.css";

const EditProfile = () => {
  // Employee state to store current details
  const [employee, setEmployee] = useState(null);

  // State for fields that need to be updated
  const [updatedFields, setUpdatedFields] = useState([{ category: "firstName", value: "", error: "" }]);

  // Error state to display messages
  const [error, setError] = useState("");

  // Retrieve the username from local storage
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // Fetch employee details based on the username
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`employee/employee-username/${username}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        });

        setEmployee(response.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError(err.response?.data || "Failed to load employee details.");
      }
    };

    if (username) {
      fetchEmployeeData();
    }
  }, [username]);

  // Add a new field to update
  const addField = () => {
    setUpdatedFields([...updatedFields, { category: "", value: "", error: "" }]);
  };

  // Handle category selection for field update
  const handleCategoryChange = (index, event) => {
    const newFields = [...updatedFields];
    newFields[index].category = event.target.value;
    setUpdatedFields(newFields);
  };

  // Validate and handle input change for updated fields
  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const newFields = [...updatedFields];
    newFields[index].value = value;

    // Email validation
    if (newFields[index].category === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newFields[index].error = "Invalid email format!";
    } 
    // Phone number validation
    else if (newFields[index].category === "phoneNumber" && !/^\d{10}$/.test(value)) {
      newFields[index].error = "Phone number must be 10 digits!";
    } 
    // Password validation
    else if (newFields[index].category === "password" && value.length < 8) {
      newFields[index].error = "Password must be at least 8 characters long!";
    } 
    else {
      newFields[index].error = "";
    }

    setUpdatedFields(newFields);
  };

  // Remove a field from the update list
  const removeField = (index) => {
    setUpdatedFields(updatedFields.filter((_, i) => i !== index));
  };

  // Update employee profile details
  const handleUpdateProfile = async () => {
    try {
      if (!employee || updatedFields.length === 0) {
        alert("Please add at least one field to update.");
        return;
      }

      // Construct updated data object based on non-empty fields
      const updatedData = updatedFields.reduce((acc, field) => {
        if (field.category && field.value && !field.error) {
          acc[field.category] = field.value;
        }
        return acc;
      }, {});

      await api.patch(`employee/update/employee-record/${employee.employeeId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          "Content-Type": "application/json",
        },
      });

      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating employee profile:", err);
      setError(err.response?.data || "Failed to update profile.");
    }
  };

  return (
    <div className="container-lg w-100 mx-auto p-4">
      <h2 className="text-center mb-4">Edit Profile</h2>

      {/* Display error message if present */}
      {error && <div className="alert alert-danger">{error}</div>}

      {employee ? (
        <div className="card shadow-lg p-4">
          {/* Button to add more fields for updating */}
          <button className="btn btn-primary mb-3" onClick={addField}>➕ Add More Fields</button>

          {updatedFields.length > 0 && (
            <div className="row">
              {updatedFields.map((field, index) => (
                <div key={index} className="col-md-6 mb-3">
                  {/* Dropdown to select which field to update */}
                  <label className="form-label">Select Category:</label>
                  <select className="form-select" onChange={(e) => handleCategoryChange(index, e)} value={field.category}>
                    <option value="">-- Select --</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                    <option value="username">Username</option>
                    <option value="password">Password</option>
                    <option value="phoneNumber">Phone Number</option>
                  </select>

                  {field.category && (
                    <>
                      {/* Input field for new value */}
                      <input
                        className={`form-control ${field.error ? "is-invalid" : ""}`}
                        type={field.category === "password" ? "password" : "text"}
                        value={field.value}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder={`Enter new ${field.category.replace(/([A-Z])/g, " $1")}`}
                      />
                      {/* Display validation errors */}
                      {field.error && <div className="invalid-feedback">{field.error}</div>}
                    </>
                  )}

                  {/* Button to remove field from the update list */}
                  {updatedFields.length > 1 && (
                    <button className="btn btn-danger mt-2" onClick={() => removeField(index)}>❌ Remove</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Buttons to save changes or cancel */}
          <div className="button-container mt-4">
            <button className="btn btn-success me-3 text-nowrap" onClick={handleUpdateProfile}>✅ Save Changes</button>
            <button className="btn btn-secondary" onClick={() => navigate("/profile")}>❌ Cancel</button>
          </div>
        </div>
      ) : (
        !error && <p className="text-center text-muted">Loading employee details...</p>
      )}
    </div>
  );
};

export default EditProfile;
