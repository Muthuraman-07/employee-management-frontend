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

  const username = localStorage.getItem("username"); // Fetch username from localStorage

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

  // const calculateWorkingHours = (checkIn, checkOut) => {
  //   if (!checkIn || !checkOut) return "Incomplete";
  //   const checkInTime = new Date(`${date}T${checkIn}:00`);
  //   const checkOutTime = new Date(`${date}T${checkOut}:00`);
  //   const diff = (checkOutTime - checkInTime) / (1000 * 60 * 60);
  //   return diff.toFixed(2);
  // };

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

    // Ensure correct time format
    const formattedCheckIn = `${date}T${clockInTime}:00`;
    const formattedCheckOut = `${date}T${clockOutTime}:00`;

    const newEntry = {
      clockInTime: formattedCheckIn,
      clockOutTime: formattedCheckOut
    };

    try {
      await api.post(`/attendance/attendanceRecords/${employeeId}`, newEntry); // Send data to backend
      setEntries([...entries, newEntry]); // Update UI
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

  // const handleEditAttendance = (index) => {
  //   const entryToEdit = entries[index];
  //   setDate(entryToEdit.date);
  //   setCheckIn(entryToEdit.clockInTime || "");
  //   setCheckOut(entryToEdit.clockOutTime || "");
  //   setEditIndex(index);
  //   setShowModal(true);
  // };

  // const handleDeleteAttendance = (index) => {
  //   if (window.confirm("Are you sure you want to delete this entry?")) {
  //     setEntries(entries.filter((_, i) => i !== index));
  //   }
  // };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary fw-bold">Employee Attendance</h1>
      <button
        className="btn btn-outline-primary btn-md rounded-pill mb-4"
        onClick={handleMarkAttendance}
      >
        <i className="bi bi-calendar-plus me-1"></i> Mark Attendance
      </button>

      {/* {entries.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light py-3">
            <h5 className="mb-0 fw-bold text-info">
              <i className="bi bi-list-check me-2"></i> Attendance Log
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">Date</th>
                    <th className="text-center">Check-In</th>
                    <th className="text-center">Check-Out</th>
                    <th className="text-center">Working Hours</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={index}>
                      <td className="text-center fw-semibold">{entry.date}</td>
                      <td className="text-center">{entry.checkIn}</td>
                      <td className="text-center">{entry.checkOut}</td>
                      <td className="text-center">{entry.workingHours}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-warning rounded-pill me-2"
                          onClick={() => handleEditAttendance(index)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => handleDeleteAttendance(index)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )} */}

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
