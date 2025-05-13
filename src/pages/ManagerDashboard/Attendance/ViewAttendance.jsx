import React, { useState, useEffect } from "react";
import { api } from "../../../service/api"; // Adjust path as needed
import "./ViewAttendance.css";

const ViewAttendance = () => {
  const [employeeId, setEmployeeId] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username"); // Fetch username from localStorage

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
        console.error("Error fetching employee details:", error);
        setError("Error fetching employee details.");
      }
    };

    fetchEmployeeId();
  }, [username]);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      if (!employeeId) return;

      try {
        console.log(`Fetching attendance records for employee ID: ${employeeId}`);
        const response = await api.get(`/attendance/all-records/${employeeId}`);
        setAttendanceRecords(response.data);
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        setError("Error fetching attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [employeeId]);

  if (loading) return <p>Loading attendance records...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // ✅ **Updated function: Extracts only date from clockInTime**
  const extractDate = (timestamp) => {
    return new Date(timestamp).toISOString().split("T")[0]; // Extracts YYYY-MM-DD
  };

  // ✅ **Updated function: Extracts only time from timestamp**
  const extractTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }); // HH:MM format
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Records for Employee ID -  {employeeId || "Loading..."}</h2>
      {attendanceRecords.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
            <th>Attendance-Id</th>
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
                <td>{(record.attendanceID)}</td>
                <td>{extractDate(record.clockInTime)}</td> {/* ✅ Extracted Date */}
                <td>{extractTime(record.clockInTime)}</td> {/* ✅ Extracted Time */}
                <td>{extractTime(record.clockOutTime)}</td> {/* ✅ Extracted Time */}
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
