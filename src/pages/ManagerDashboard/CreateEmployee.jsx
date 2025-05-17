import React, { useState, useEffect } from "react";
import { authApi, api } from "../../service/api"; // Import API instances
import "./CreateEmployee.css";
import DatePicker from "react-datepicker";
import { Modal, Button } from "react-bootstrap";

const RegisterEmployee = () => {
  const [employee, setEmployee] = useState({
    employeeId: "",
    managerId: localStorage.getItem("employeeId") || "", // Auto-filled from logged-in user
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    department: "",
    role: "ROLE_EMPLOYEE",
    shiftId: "",
    joinedDate: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Error handling for existing employee
  const [showErrorPopup, setShowErrorPopup] = useState(false); // ✅ Added state to control error modal
  useEffect(() => {
    // Fetch logged-in employee details and update managerId
    const fetchLoggedInEmployee = async () => {
      try {
        const response = await api.get(`employee/employee-username/${localStorage.getItem("username")}`);
        setEmployee((prev) => ({ ...prev, managerId: response.data.employeeId })); // Set managerId automatically
      } catch (error) {
        console.error("Error fetching logged-in employee data:", error);
      }
    };

    fetchLoggedInEmployee();
  }, []);

  const isWeekday = (date) => {
    return date.getDay() !== 0 && date.getDay() !== 6;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation Patterns
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation Rules
    if (employee.employeeId < 1) {
      alert("Employee ID must be greater than zero.");
      return;
    }

    if (employee.managerId < 1) {
      alert("Manager ID must be greater than zero.");
      return;
    }

    if (employee.username.length < 2 || employee.username.length > 50) {
      alert("Username must be between 2 and 50 characters.");
      return;
    }

    if (!passwordRegex.test(employee.password)) {
      alert("Password must contain at least one uppercase letter, one lowercase letter, and one number.");
      return;
    }

    if (employee.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (employee.firstName.length < 2 || employee.firstName.length > 50) {
      alert("First name must be between 2 and 50 characters.");
      return;
    }

    if (employee.lastName.length < 2 || employee.lastName.length > 50) {
      alert("Last name must be between 2 and 50 characters.");
      return;
    }

    if (!emailRegex.test(employee.email)) {
      alert("Email should be valid.");
      return;
    }

    if (!phoneRegex.test(employee.phoneNumber)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    if (employee.department.length < 2 || employee.department.length > 50) {
      alert("Department must be between 2 and 50 characters.");
      return;
    }

    if (employee.role.length < 2 || employee.role.length > 50) {
      alert("Role must be between 2 and 50 characters.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (employee.joinedDate >= today) {
      alert("Joined date must be in the past.");
      return;
    }

     try {
      await authApi.post("/register", employee);
      alert("Employee registered successfully!");
    } catch (error) {
      console.error("Error registering employee:", error);
      
      if (error.response && error.response.status === 500) {
        setErrorMessage("❌ Employee already registered!");
        setShowErrorPopup(true); // ✅ Show error modal when 500 occurs
      } else {
        setErrorMessage("❌ Registration failed. Please try again.");
        setShowErrorPopup(true);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Register Employee</h2>

     {/* ✅ Show error message if Employee Already Registered */}
     {errorMessage && <p className="text-danger text-center fw-bold">{errorMessage}</p>}

      <form className="card p-4 shadow-lg" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Employee ID</label>
            <input type="number" className="form-control" name="employeeId" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Manager ID</label>
            <input type="number" className="form-control" name="managerId" value={employee.managerId} readOnly />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name</label>
            <input type="text" className="form-control" name="firstName" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-control" name="lastName" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" name="username" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input type={showPassword ? "text" : "password"} className="form-control" name="password" onChange={handleChange} required />
              <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                {showPassword ? "👁 Hide" : "🔍 Show"}
              </button>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Phone Number</label>
            <input type="text" className="form-control" name="phoneNumber" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Department</label>
            <input type="text" className="form-control" name="department" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Shift ID</label>
            <input type="text" className="form-control" name="shiftId" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
  <label className="form-label">Joined Date</label>
  <div className="input-group">
    <span className="input-group-text"><i className="bi bi-calendar" ></i></span> {/* ✅ Bootstrap Calendar Icon */}
    <DatePicker
      selected={employee.joinedDate}
      onChange={(date) => setEmployee({ ...employee, joinedDate: date })}
      filterDate={isWeekday} 
      dateFormat="yyyy-MM-dd"
      className="form-control"
      maxDate={new Date()} // ✅ Prevent selection of future dates
      required
    />
  </div>

          </div>
          <div className="col-md-6 mb-3">
           <label className="form-label">Role</label>
           <select className="form-select" name="role" defaultValue="" onChange={handleChange} required>
  <option value="" disabled>-- Select Role --</option>
  <option value="ROLE_EMPLOYEE">Employee</option>
  <option value="ROLE_MANAGER">Manager</option>
</select>

            </div>
        </div>
        <button type="submit" className="btn btn-success w-100 mt-3">Register Employee</button>
      </form>

      {/* ✅ Error Modal Popup */}
      <Modal show={showErrorPopup} onHide={() => setShowErrorPopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-danger fw-bold">{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorPopup(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegisterEmployee;
