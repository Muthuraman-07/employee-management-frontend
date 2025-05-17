import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; 
import { api } from "../../service/api";
import { exportToPDF, exportToExcel } from "../../utils/exportUtils";
import "bootstrap/dist/css/bootstrap.min.css"; 

const LeaveReports = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [employeeId, setEmployeeId] = useState(""); 
  const [showHeaders, setShowHeaders] = useState(false); // ✅ Track header visibility

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const generateLeaveReport = async () => {
    if (!employeeId || isNaN(employeeId)) {
      alert("Invalid Employee ID. Please enter a valid number.");
      return;
    }

    try {
      const response = await api.get(`leaveBalance/leave-report/${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });

      setLeaveData(response.data);
      setShowHeaders(true); // ✅ Show headers after clicking "Generate Report"
      handleClose();
    } catch (error) {
      console.error("Error fetching leave data:", error);
      alert("Failed to fetch leave report. Please try again.");
    }
  };

  return (
    <div className="container mt-4 px-4" style={{ minWidth: "100vh" }}>
      <h2 className="mb-4">Leave Balance Report</h2>

      <div className="mb-5 d-flex justify-content-center align-items-center flex-wrap gap-2">
        <Button variant="primary" onClick={handleShow}>
          Generate Report
        </Button>
        <Button variant="primary" onClick={() => exportToPDF("leaveReport")}>
          Export to PDF
        </Button>
        <Button variant="primary" onClick={() => exportToExcel("leaveReport")}>
          Export to Excel
        </Button>
      </div>

      {/* ✅ Fancy Modal for Employee ID Input */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Employee ID</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="employeeId">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={generateLeaveReport}>Generate</Button>
        </Modal.Footer>
      </Modal>

      <div className="table-responsive">
        <table id="leaveReport" className="table table-bordered table-striped">
          {showHeaders && ( // ✅ Show headers **only** after clicking "Generate Report"
            <thead className="table-dark">
              <tr>
                <th>Employee ID</th>
                <th>Leave Type</th>
                <th>Used Leaves</th>
                <th>Remaining Leaves</th>
              </tr>
            </thead>
          )}
          <tbody>
            {leaveData.map((leave, index) => (
              <tr key={index}>
                <td>{leave.employeeId}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.used}</td>
                <td>{leave.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveReports;
