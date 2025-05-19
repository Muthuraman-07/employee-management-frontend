import React, { useState } from "react";
import { api } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Shift.css";

const Shift = () => {
  // State to control the visibility of the delete shift modal
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  // State to store the Shift ID entered by the user
  const [shiftId, setShiftId] = useState("");
  const navigate = useNavigate();
  const employeeId = localStorage.getItem("employeeId");

  /**
   * Handle the display of the delete shift modal.
   */
  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  /**
   * Confirm and delete the shift based on the entered Shift ID.
   */
  const confirmDeleteShift = async () => {
    // Validate the Shift ID input
    if (!shiftId || isNaN(shiftId)) {
      alert("⚠️ Please enter a valid Shift ID.");
      return;
    }

    try {
      console.log(`Attempting to delete shift with ID: ${shiftId}`);
      // Send DELETE request to the API
      await api.delete(`shift/delete-shift/${shiftId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Include JWT token for authentication
        },
      });

      alert(`✅ Shift ID ${shiftId} has been deleted successfully!`);
      console.log(`Shift ${shiftId} deleted.`);
      setShowDeletePopup(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("❌ Error deleting shift:", error.response?.data || error.message);
      alert("❌ Failed to delete shift. Please try again.");
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
