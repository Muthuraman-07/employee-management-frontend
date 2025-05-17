import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap"; // ✅ Added Bootstrap Modal for error handling
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { api } from "../../../service/api";
import "bootstrap/dist/css/bootstrap.min.css"; 

const Attendance = () => {
  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState(null);
  const [clockInTime, setCheckIn] = useState("");
  const [clockOutTime, setCheckOut] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Error handling
  const [showErrorPopup, setShowErrorPopup] = useState(false); // ✅ Error popup state
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

  const isWeekday = (date) => {
    return date.getDay() !== 0 && date.getDay() !== 6;
  };

  const handleMarkAttendance = () => {
    setDate(null);
    setCheckIn("");
    setCheckOut("");
    setShowModal(true);
  };

  const handleSingleEntrySubmit = async () => {
    if (!date || !employeeId) {
      setErrorMessage("⚠ Error: Missing required fields.");
      setShowErrorPopup(true);
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];
    const formattedCheckIn = `${formattedDate}T${clockInTime}:00`;
    const formattedCheckOut = `${formattedDate}T${clockOutTime}:00`;

    const newEntry = {
      clockInTime: formattedCheckIn,
      clockOutTime: formattedCheckOut
    };

    try {
      await api.post(`/attendance/attendanceRecords/${employeeId}`, newEntry); 
      setEntries([...entries, newEntry]);
      setShowModal(false);
      alert("✅ Attendance recorded successfully!");
    } catch (error) {
      console.error("❌ Error saving attendance:", error);

      if (error.response && error.response.status === 400) {
        setErrorMessage("⚠ Attendance already marked for this date!");
      } else {
        setErrorMessage("❌ Failed to record attendance. Please try again.");
      }

      setShowErrorPopup(true);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary fw-bold">Employee Attendance</h1>

      <div className="d-flex gap-3">
        <button className="btn btn-outline-primary btn-md rounded-pill" onClick={handleMarkAttendance}>
          <i className="bi bi-calendar-plus me-1"></i> Mark Attendance
        </button>
        <a href={`/viewAttendance`} className="btn btn-outline-secondary btn-md rounded-pill">
          <i className="bi bi-eye"></i> View Attendance
        </a>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-primary">Add Attendance</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Date:</label>
                    <DatePicker
                      selected={date}
                      onChange={(selectedDate) => setDate(selectedDate)}
                      filterDate={isWeekday} 
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Check-In Time:</label>
                    <input type="time" className="form-control form-control-md" name="checkIn" value={clockInTime} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Check-Out Time:</label>
                    <input type="time" className="form-control form-control-md" name="checkOut" value={clockOutTime} onChange={(e) => setCheckOut(e.target.value)} />
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

export default Attendance;
