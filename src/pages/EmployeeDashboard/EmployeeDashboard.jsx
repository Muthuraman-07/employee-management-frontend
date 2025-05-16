import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [data, setData] = useState({});
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`/employee/employee-username/${username}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [username]);

  useEffect(() => {
    const swapStatus = localStorage.getItem(`shiftSwap_${data.employeeId}`);

    if (swapStatus) {
      toast.info(`Your shift swap request was ${swapStatus}.`, {
        position: "top-right",
        autoClose: 3000,
      });

      localStorage.removeItem(`shiftSwap_${data.employeeId}`);
    }
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("jwtToken");
    console.log("Logged out");
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* ✅ Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ Sidebar Navigation with Hover Effect */}
      <div className="sidebar">
        <ul className="nav flex-column">
          <li className="nav-item" onClick={() => navigate("/profile")}>
            <i className="bi bi-person-fill"></i> Profile
          </li>
          <li className="nav-item" onClick={() => navigate("/attendance")}>
            <i className="bi bi-calendar-check-fill"></i> Attendance
          </li>
          <li className="nav-item" onClick={() => navigate("/empLeave")}>
            <i className="bi bi-file-earmark-text-fill"></i> Leave Requests
          </li>
          <li className="nav-item" onClick={() => navigate("/empShift")}>
            <i className="bi bi-clock-fill"></i> Shift Details
          </li>
          <li className="nav-item text-danger fw-bold" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </li>
        </ul>
      </div>

      {/* ✅ Main Content */}
      <div className="container mt-5">
        <h2 className="mb-4 text-center text-primary">Welcome to Your Employee Dashboard</h2>

        <div className="card shadow p-4">
          <img className="card-img-top" src="/emp1.gif" alt="Employee Workspace" />
          <div className="card-body">
            <p>
              This dashboard gives employees access to key details regarding attendance, leave requests, shifts,
              and assigned projects. Stay connected, track progress, and manage your work-life balance efficiently.
            </p>

            <h3>Work & Responsibilities</h3>
            <ul>
              <li><strong>Profile Management:</strong> Keep your details up to date.</li>
              <li><strong>Attendance Tracking:</strong> Monitor your work hours.</li>
              <li><strong>Leave Requests:</strong> Apply and check leave status.</li>
              <li><strong>Shift Information:</strong> View and manage your assigned shifts.</li>
              <li><strong>Project Assignments:</strong> Stay updated on tasks.</li>
              <li><strong>Performance Metrics:</strong> Receive feedback and track growth.</li>
            </ul>

            <h3>Company Announcements</h3>
            <p>
              Stay informed about upcoming company events, training sessions, and important updates regarding
              workplace policies and growth initiatives.
            </p>

            <h3>Employee Growth & Learning</h3>
            <ul>
              <li>Access <strong>career development programs</strong> to enhance skills.</li>
              <li>Engage in <strong>mentorship & training</strong> sessions.</li>
              <li>Participate in <strong>team-building activities</strong> for collaboration.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
