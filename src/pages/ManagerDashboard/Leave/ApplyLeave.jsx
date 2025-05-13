import React, { useState, useEffect } from "react";
import { api } from "../../../service/api";
// import "./ApplyLeave.css";

const ApplyLeave = () => {
  const [leave, setLeave] = useState({ startDate: "", endDate: "", leaveType: "Vacation" }); // Default selection
  const [employeeId, setEmployeeId] = useState(null);
  const username = localStorage.getItem("username");

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
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeId();
  }, [username]);

  const handleChange = (e) => {
    setLeave({ ...leave, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the start date is today or in the future
    const today = new Date().toISOString().split("T")[0];
    if (leave.startDate < today) {
      alert("Start Date must be today or in the future.");
      return;
    }

    // Validate that the end date is in the future
    if (leave.endDate <= leave.startDate) {
      alert("End Date must be later than Start Date.");
      return;
    }

    // Validate leaveType length (matching DTO constraints)
    if (leave.leaveType.length < 2 || leave.leaveType.length > 30) {
      alert("Leave Type must be between 2 and 30 characters.");
      return;
    }

    if (!employeeId) {
      alert("Error: Employee ID not found.");
      return;
    }

    // Ensure time format is included when sending the request
    const formattedStartDate = `${leave.startDate}T09:00:00`; // Default morning time
    const formattedEndDate = `${leave.endDate}T18:00:00`; // Default evening time

    try {
      console.log({ ...leave, startDate: formattedStartDate, endDate: formattedEndDate });

      await api.post(`/leave/apply-leave/${employeeId}`, {

        startDate: formattedStartDate,
        endDate: formattedEndDate,
        leaveType: leave.leaveType,
      });

      alert("Leave request submitted successfully!");
    } catch (error) {
      console.error("Error applying leave:", error);
    }
  };

  return (
    <div className="apply-leave-container">
      <h2>Apply for Leave</h2>
      <form onSubmit={handleSubmit}>
        <label>Start Date:</label>
        <input type="date" name="startDate" onChange={handleChange} required />

        <label>End Date:</label>
        <input type="date" name="endDate" onChange={handleChange} required />

        <label>Leave Type:</label>
        <select name="leaveType" onChange={handleChange} value={leave.leaveType} required>
          <option value="Vacation">Vacation</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
        </select>

        <button type="submit">Submit Leave Request</button>
      </form>
    </div>
  );
};

export default ApplyLeave;
