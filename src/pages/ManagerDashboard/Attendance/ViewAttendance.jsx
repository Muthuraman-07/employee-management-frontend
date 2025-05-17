import React, { useState, useEffect } from "react";
import { api } from "../../../service/api"; 
import "./ViewAttendance.css";

const ViewAttendance = () => {
  // State variables to manage employee details and attendance records
  const [employeeId, setEmployeeId] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch username from localStorage
  const username = localStorage.getItem("username");

  // Fetch employee ID based on username
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        if (!username) {
          console.error("No username found.");
          setError("Username not found.");
          setLoading(false);
          return;
        }

        console.log("Fetching employee ID...");
        const response = await api.get(`employee/employee-username/${username}`);

        if (response.data && response.data.employeeId) {
          console.log("Received Employee ID:", response.data.employeeId);
          setEmployeeId(response.data.employeeId);
        } else {
          console.error("Employee ID not found for the username.");
          setError("Employee ID not found.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error.response?.data || error.message);
        setError("Error fetching employee details.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  // Fetch attendance records once employee ID is retrieved
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!employeeId) return;

      try {
        console.log(`Fetching attendance records for employee ID: ${employeeId}`);
        const response = await api.get(`/attendance/all-records/${employeeId}`);
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error("Error fetching attendance records:", error.response?.data || error.message);
        setError("Error fetching attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [employeeId]);

  // Display loading message while fetching data
  if (loading) return <p>Loading attendance records...</p>;
  
  // Display error message if an issue occurs
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Function to extract date from timestamp
  const extractDate = (timestamp) => {
    return new Date(timestamp).toISOString().split("T")[0]; 
  };

  // Function to extract time from timestamp
  const extractTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }); 
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Records for Employee ID - {employeeId || "Loading..."}</h2>
      
      {/* Display message if no records are found */}
      {attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Attendance ID</th>
              <th>Date</th>
              <th>Clock-In Time</th>
              <th>Clock-Out Time</th>
              <th>Hours Worked</th>
              <th>Is Present</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.attendanceID}</td>
                <td>{extractDate(record.clockInTime)}</td> 
                <td>{extractTime(record.clockInTime)}</td> 
                <td>{extractTime(record.clockOutTime)}</td> 
                <td>{record.workHours}</td>
                <td>{record.isPresent ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAttendance;
