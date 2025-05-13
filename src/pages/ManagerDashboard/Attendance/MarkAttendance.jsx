import React, { useState, useEffect } from "react";
import { api } from "../../../service/api"; // Import API instance

const Attendance = () => {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [clockInTime, setCheckIn] = useState("");
  const [clockOutTime, setCheckOut] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        if (!username) {
          console.error("No username found.");
          return;
        }

        const response = await api.get(`employee/employee-username/${username}`);
        setEmployeeId(response.data.employeeId);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeId();
  }, [username]);

  const handleMarkAttendance = () => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setCheckIn("");
    setCheckOut("");
    setEditIndex(null);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "date":
        setDate(value);
        break;
      case "checkIn":
        setCheckIn(value);
        break;
      case "checkOut":
        setCheckOut(value);
        break;
      default:
        break;
    }
  };

  const handleSingleEntrySubmit = async () => {
    if (!date || !employeeId) {
      alert("Error: Missing required fields.");
      return;
    }

    const alreadyExists = entries.some((entry) => entry.date === date);
    if (alreadyExists) {
      alert("Attendance for this date already exists!");
      return;
    }

    const formattedCheckIn = `${date}T${clockInTime}:00`;
    const formattedCheckOut = `${date}T${clockOutTime}:00`;

    const newEntry = {
      clockInTime: formattedCheckIn,
      clockOutTime: formattedCheckOut
    };

    try {
      await api.post(`/attendance/attendanceRecords/${employeeId}`, newEntry); 
      setEntries([...entries, newEntry]);
      setShowModal(false);
      setDate("");
      setCheckIn("");
      setCheckOut("");
      setEditIndex(null);
      alert("Attendance recorded successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to record attendance.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary fw-bold">Employee Attendance</h1>

      {/* ✅ Updated: "View Attendance" Link Beside "Mark Attendance" */}
      <div className="d-flex gap-3">
        <button
          className="btn btn-outline-primary btn-md rounded-pill"
          onClick={handleMarkAttendance}
        >
          <i className="bi bi-calendar-plus me-1"></i> Mark Attendance
        </button>

        <a
          href={`/viewAttendance`}
          className="btn btn-outline-secondary btn-md rounded-pill"
        >
          <i className="bi bi-eye"></i> View Attendance
        </a>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1" aria-labelledby="addEditModalLabel" aria-modal="true" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-primary">
                  {editIndex !== null ? "Edit Attendance" : "Add Attendance"}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label fw-semibold">Date:</label>
                    <input type="date" className="form-control form-control-md" id="date" name="date" value={date} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="checkIn" className="form-label fw-semibold">Check-In Time:</label>
                    <input type="time" className="form-control form-control-md" id="checkIn" name="checkIn" value={clockInTime} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="checkOut" className="form-label fw-semibold">Check-Out Time:</label>
                    <input type="time" className="form-control form-control-md" id="checkOut" name="checkOut" value={clockOutTime} onChange={handleInputChange} />
                  </div>
                </form>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary rounded-pill" onClick={handleSingleEntrySubmit}>Add Entry</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
