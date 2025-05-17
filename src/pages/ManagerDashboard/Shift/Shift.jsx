import React, { useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Shift.css";

const Shift = () => {
  // State to control delete shift popup visibility
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  
  // State to store shift ID for deletion
  const [shiftId, setShiftId] = useState("");

  // Initialize navigation for redirection
  const navigate = useNavigate();

  // Retrieve employee ID from local storage
  const employeeId = localStorage.getItem("employeeId");

  // Function to show the delete shift popup
  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  // Function to confirm shift deletion
  const confirmDeleteShift = async () => {
    if (!shiftId || isNaN(shiftId)) {
      alert("Please enter a valid Shift ID.");
      return;
    }

    try {
      await api.delete(`shifts/delete-shift/${shiftId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, 
        },
      });

      alert(`Shift ID ${shiftId} has been deleted successfully.`);
      console.log(`Shift ${shiftId} deleted.`);
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Error deleting shift:", error.response?.data || error.message);
      alert("Failed to delete shift. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      {/* Title */}
      <h2 className="text-center text-primary fw-bold mb-4">Shift Management</h2>

      {/* Shift Navigation Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <button className="btn btn-primary" onClick={() => navigate("/createShift")}>Create Shift</button>
        <button className="btn btn-primary" onClick={() => navigate("/allocatedShift")}>Allocated Shift</button>
        <button className="btn btn-primary" onClick={() => navigate("/getAllShift")}>Available Shift</button>
        <button className="btn btn-primary" onClick={() => navigate("/updateShift")}>Shift Changes</button>
        <button className="btn btn-primary" onClick={() => navigate("/shiftSwapRequests")}>Shift Swap Requests</button>
        <button className="btn btn-warning fw-bold" onClick={() => navigate("/shiftSwap")}>Shift Swap</button>
        <button className="btn btn-danger fw-bold" onClick={handleDeletePopup}>
          <i className="bi bi-trash-fill"></i> Delete Shift
        </button>
      </div>

      {/* Delete Shift Modal */}
      {showDeletePopup && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Shift Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeletePopup(false)}></button>
              </div>
              <div className="modal-body">
                {/* Input field for shift ID */}
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Shift ID"
                  value={shiftId}
                  onChange={(e) => setShiftId(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeletePopup(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDeleteShift}>Delete Shift</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shift;
