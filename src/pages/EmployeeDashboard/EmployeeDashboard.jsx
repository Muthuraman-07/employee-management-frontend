import React, { useEffect, useState } from "react";
import "./EmployeeDashboard.css";
import { api } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeeDashboard = () => {
  // State to store employee details
  const [data, setData] = useState({});
  
  // Retrieve username from local storage
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  // Fetch employee data from API when the component mounts
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`/employee/employee-username/${username}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error.response?.data || error.message);
      }
    };

    if (username) {
      fetchEmployeeData();
    }
  }, [username]);

  // Display shift swap notification if there is an update
  useEffect(() => {
    const swapStatus = localStorage.getItem(`shiftSwap_${data.employeeId}`);

    if (swapStatus) {
      toast.info(`Your shift swap request was ${swapStatus}.`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Remove notification after displaying once
      localStorage.removeItem(`shiftSwap_${data.employeeId}`);
    }
  }, [data]);

  // Display leave approval or rejection notification if available
  useEffect(() => {
    const leaveStatus = localStorage.getItem(`leaveRequest_${data.employeeId}`);

    if (leaveStatus) {
      toast.info(`Your leave request has been ${leaveStatus.toLowerCase()}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Remove notification after displaying once
      localStorage.removeItem(`leaveRequest_${data.employeeId}`);
    }
  }, [data]);

  // Prevent back navigation after login
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
      console.log("Back button disabled!");
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  // Logout function to clear session data and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("jwtToken");
    console.log("Logged out");
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <ul>
          <li onClick={() => navigate("/profile")} className="active">
            <i className="icon"></i> Profile
          </li>
          <li onClick={() => navigate("/attendance")}>
            <i className="icon"></i> Attendance
          </li>
          <li onClick={() => navigate("/empLeave")}>
            <i className="icon"></i> Leave Requests
          </li>
          <li onClick={() => navigate("/empShift")}>
            <i className="icon"></i> Shift Details
          </li>
          <li className="logout-button" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h2>Welcome to Your Employee Dashboard</h2>
        <div className="content">
          <img src="/emp1.gif" alt="Employee Workspace" />
          <p>
            This dashboard provides access to key details regarding attendance, leave requests, shifts, 
            and assigned projects. Track progress and manage your work-life balance efficiently.
          </p>

          <h3>Work and Responsibilities</h3>
          <ul>
            <li><strong>Profile Management:</strong> Update your details.</li>
            <li><strong>Attendance Tracking:</strong> Monitor your work hours.</li>
            <li><strong>Leave Requests:</strong> Apply and check leave status.</li>
            <li><strong>Shift Information:</strong> View and manage assigned shifts.</li>
            <li><strong>Project Assignments:</strong> Stay updated on tasks.</li>
            <li><strong>Performance Metrics:</strong> Receive feedback and track progress.</li>
          </ul>

          <h3>Company Announcements</h3>
          <p>
            Stay informed about upcoming company events, training sessions, 
            and important workplace updates.
          </p>

          <h3>Employee Growth and Learning</h3>
          <ul>
            <li>Access <strong>career development programs</strong> to enhance skills.</li>
            <li>Participate in <strong>mentorship and training</strong> sessions.</li>
            <li>Engage in <strong>team-building activities</strong> for collaboration.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
