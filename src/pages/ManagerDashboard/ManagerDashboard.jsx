import React, { useState } from "react";
import { api } from "../../service/api";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // ✅ Bootstrap Icons Import
import "./ManagerDashboard.css";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [employeeId, setEmployeeId] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("jwtToken");
    console.log("Logged out successfully.");
    navigate("/");
  };

  const handleDeletePopup = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!employeeId || isNaN(employeeId)) {
      alert("Please enter a valid Employee ID.");
      return;
    }

    try {
      await api.delete(`/employee/delete/employee-record/${employeeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });

      alert(`Employee ID ${employeeId} has been deleted successfully!`);
      console.log("Employee deleted.");
      setShowDeletePopup(false);
    } catch (error) {
      console.error("Error deleting employee:", error.response?.data || error.message);
      alert("Failed to delete employee. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      {/* ✅ Sidebar Navigation with Hover Effect */}
      <div className="sidebar">
        <ul className="nav flex-column">
          <li className="nav-item" onClick={() => navigate("/createEmployee")}>
            <i className="bi bi-person-plus-fill"></i> Register Employee
          </li>
          <li className="nav-item" onClick={() => navigate("/viewEmployee")}>
            <i className="bi bi-people-fill"></i> View Employees
          </li>
          <li className="nav-item" onClick={() => navigate("/attendance")}>
            <i className="bi bi-calendar-check-fill"></i> Attendance
          </li>
          <li className="nav-item" onClick={() => navigate("/leave")}>
            <i className="bi bi-file-earmark-text-fill"></i> Leaves
          </li>
          <li className="nav-item" onClick={() => navigate("/shift")}>
            <i className="bi bi-clock-fill"></i> Shifts
          </li>
          <li className="nav-item" onClick={() => navigate("/reports")}>
            <i className="bi bi-bar-chart-line-fill"></i> Reports
          </li>
          <li className="nav-item" onClick={() => navigate("/profile")}>
            <i className="bi bi-person-fill"></i> Profile
          </li>
          <li className="nav-item text-danger fw-bold" onClick={handleDeletePopup}>
            <i className="bi bi-trash-fill"></i> Delete Employee
          </li>
          <li className="nav-item text-danger fw-bold" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </li>
        </ul>
      </div>

      {/* ✅ Fancy Delete Employee Modal */}
      <Modal show={showDeletePopup} onHide={() => setShowDeletePopup(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Employee Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
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
          <Button variant="secondary" onClick={() => setShowDeletePopup(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Employee</Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Main Content */}
      <div className="main-content">
        <h2>About Company</h2>
        <div className="content">
          <img src="/manager.gif" alt="Presentation Board" />
          <p>
            As a global leader in digital transformation and technology solutions, we drive innovation, deliver strategic consulting, and empower businesses worldwide.
          </p>

          <h3>Our Vision & Mission</h3>
          <p>
            We envision a world where technology seamlessly integrates with human potential to create meaningful solutions. Guided by our mission to accelerate progress, we focus on harnessing emerging technologies to transform enterprises and create sustainable models.
          </p>

          <h3>Core Values</h3>
          <ul>
            <li><strong>Innovation:</strong> Continuous improvements through AI and automation.</li>
            <li><strong>Integrity:</strong> Trust and transparency in every engagement.</li>
            <li><strong>Collaboration:</strong> Partnering with businesses to drive impactful solutions.</li>
            <li><strong>Sustainability:</strong> Committing to responsible business practices.</li>
          </ul>

          <h3>Industry Expertise</h3>
          <ul>
            <li><strong>Healthcare:</strong> Transforming patient care with data-driven insights.</li>
            <li><strong>Finance:</strong> Enhancing banking operations with secure cloud solutions.</li>
            <li><strong>Retail:</strong> Personalizing customer experiences through AI analytics.</li>
          </ul>

          <h3>Technology Innovations</h3>
          <ul>
            <li>Cloud computing for seamless enterprise scalability.</li>
            <li>AI-driven automation to enhance efficiency.</li>
            <li>Advanced cybersecurity to protect businesses.</li>
            <li>Blockchain integration for secure transactions.</li>
            <li>IoT deployments for optimizing real-time operations.</li>
          </ul>

          <h3>Commitment to Sustainability</h3>
          <ul>
            <li><strong>Eco-friendly Infrastructure:</strong> Reducing carbon footprint with energy-efficient solutions.</li>
            <li><strong>Corporate Social Responsibility (CSR):</strong> Supporting community and global sustainability.</li>
            <li><strong>Ethical AI Practices:</strong> Ensuring transparency and accountability in AI development.</li>
          </ul>

          <h3>Looking Ahead</h3>
          <p>
            As businesses navigate digital transformation, we remain committed to pioneering scalable, secure, and forward-thinking solutions that create lasting impacts.
          </p>

          <h3>Join the Journey</h3>
          <p>
            Whether you're seeking world-class technology services, innovative consulting, or a transformative career, we invite you to be part of the digital revolution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
