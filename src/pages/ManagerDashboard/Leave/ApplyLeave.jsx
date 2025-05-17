import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css";

const ApplyLeave = () => {
  // State for leave request details
  const [leave, setLeave] = useState({ startDate: null, endDate: null, leaveType: "Vacation" });

  // Employee ID state
  const [employeeId, setEmployeeId] = useState(null);

  // Retrieve username from local storage
  const username = localStorage.getItem("username");

  // Fetch employee ID based on username
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        if (!username) {
          console.error("No username found.");
          return;
        }

        console.log("Fetching employee ID...");
        const response = await api.get(`employee/employee-username/${username}`);

        if (response.data && response.data.employeeId) {
          console.log("Received Employee ID:", response.data.employeeId);
          setEmployeeId(response.data.employeeId);
        } else {
          console.error("Employee ID not found for the username.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error.response?.data || error.message);
      }
    };

    fetchEmployeeId();
  }, [username]);

  // Function to disable weekends in the calendar
  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  // Handle form submission for leave request
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks for leave form fields
    if (!leave.startDate || !leave.endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (leave.endDate <= leave.startDate) {
      alert("End Date must be later than Start Date.");
      return;
    }

    if (leave.leaveType.length < 2 || leave.leaveType.length > 30) {
      alert("Leave Type must be between 2 and 30 characters.");
      return;
    }

    if (!employeeId) {
      alert("Error: Employee ID not found.");
      return;
    }

    // Formatting dates for submission
    const formattedStartDate = leave.startDate.toISOString().split("T")[0] + "T09:00:00";
    const formattedEndDate = leave.endDate.toISOString().split("T")[0] + "T18:00:00";

    try {
      console.log({ ...leave, startDate: formattedStartDate, endDate: formattedEndDate });

      await api.post(`/leave/apply-leave/${employeeId}`, {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        leaveType: leave.leaveType,
      });

      alert("Leave request submitted successfully!");
    } catch (error) {
      console.error("Error applying leave:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Apply for Leave</h2>
      <div className="card p-4 shadow-lg">
        <form onSubmit={handleSubmit}>
          {/* Start Date Field */}
          <div className="mb-3">
            <label className="form-label">Start Date:</label>
            <DatePicker
              selected={leave.startDate}
              onChange={(date) => setLeave({ ...leave, startDate: date })}
              filterDate={isWeekday} 
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </div>

          {/* End Date Field */}
          <div className="mb-3">
            <label className="form-label">End Date:</label>
            <DatePicker
              selected={leave.endDate}
              onChange={(date) => setLeave({ ...leave, endDate: date })}
              filterDate={isWeekday} 
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
            />
          </div>

          {/* Leave Type Dropdown */}
          <div className="mb-3">
            <label className="form-label">Leave Type:</label>
            <select className="form-select" name="leaveType" onChange={(e) => setLeave({ ...leave, leaveType: e.target.value })} value={leave.leaveType} required>
              <option value="Vacation">Vacation</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
            </select>
          </div>

          {/* Submit & Reset Buttons */}
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button type="submit" className="btn btn-success fw-bold">Submit Leave Request</button>
            <button type="reset" className="btn btn-secondary fw-bold">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
