import React, { useState, useEffect } from "react";
import { authApi, api } from "../../service/api"; // Import API instances
import "./CreateEmployee.css";

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

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.post("/register", employee); // Send request with all fields
      alert("Employee registered successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error registering employee:", error);
      alert("Registration failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Register Employee</h2>
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
            <input type="password" className="form-control" name="password" onChange={handleChange} required />
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
            <input type="date" className="form-control" name="joinedDate" onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Role</label>
            <select className="form-select" name="role" onChange={handleChange} required>
              <option value="ROLE_EMPLOYEE">Employee</option>
              <option value="ROLE_MANAGER">Manager</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-success w-100 mt-3">Register Employee</button>
      </form>
    </div>
  );
};

export default RegisterEmployee;
