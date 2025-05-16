import React, { useState, useEffect } from "react";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap for styling
import "./EditProfile.css"; // ✅ Custom CSS for layout improvements

const EditProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [updatedFields, setUpdatedFields] = useState([{ category: "firstName", value: "", error: "" }]);
  const [error, setError] = useState("");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

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

  const addField = () => {
    setUpdatedFields([...updatedFields, { category: "", value: "", error: "" }]);
  };

  const handleCategoryChange = (index, event) => {
    const newFields = [...updatedFields];
    newFields[index].category = event.target.value;
    setUpdatedFields(newFields);
  };

  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const newFields = [...updatedFields];
    newFields[index].value = value;

    if (newFields[index].category === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      newFields[index].error = "Invalid email format!";
    } else if (newFields[index].category === "phoneNumber" && !/^\d{10}$/.test(value)) {
      newFields[index].error = "Phone number must be 10 digits!";
    } else if (newFields[index].category === "password" && value.length < 8) {
      newFields[index].error = "Password must be at least 8 characters long!";
    } else {
      newFields[index].error = "";
    }

    setUpdatedFields(newFields);
  };

  const removeField = (index) => {
    setUpdatedFields(updatedFields.filter((_, i) => i !== index));
  };

  const handleUpdateProfile = async () => {
    try {
      if (!employee || updatedFields.length === 0) {
        alert("Please add at least one field to update.");
        return;
      }

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
    <div className="container-lg w-100 mx-auto p-4"> {/* ✅ Made wider */}
      <h2 className="text-center mb-4">Edit Profile</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {employee ? (
        <div className="card shadow-lg p-4">
          <button className="btn btn-primary mb-3" onClick={addField}>➕ Add More Fields</button>

          {updatedFields.length > 0 && (
            <div className="row">
              {updatedFields.map((field, index) => (
                <div key={index} className="col-md-6 mb-3"> {/* ✅ Adjusted width */}
                  <label className="form-label">Select Category:</label>
                  <select className="form-select" onChange={(e) => handleCategoryChange(index, e)} value={field.category}>
                    <option value="">-- Select --</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                    <option value="username">Username</option>
                    <option value="password">Password</option>
                    {/* <option value="email">Email</option> */}
                    <option value="phoneNumber">Phone Number</option>
                  </select>

                  {field.category && (
                    <>
                      <input
                        className={`form-control ${field.error ? "is-invalid" : ""}`}
                        type={field.category === "password" ? "password" : "text"}
                        value={field.value}
                        onChange={(e) => handleInputChange(index, e)}
                        placeholder={`Enter new ${field.category.replace(/([A-Z])/g, " $1")}`}
                      />
                      {field.error && <div className="invalid-feedback">{field.error}</div>}
                    </>
                  )}

                  {updatedFields.length > 1 && (
                    <button className="btn btn-danger mt-2" onClick={() => removeField(index)}>❌ Remove</button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="button-container mt-4"> {/* ✅ Improved button spacing */}
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
