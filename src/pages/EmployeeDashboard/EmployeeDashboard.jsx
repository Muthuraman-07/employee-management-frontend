import React, { useEffect, useState } from 'react';
import './EmployeeDashboard.css';
import { api } from '../../service/api';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const [data, setData] = useState({});
  const username = localStorage.getItem('username'); // Fetch username from local storage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await api.get(`/employee/employee-username/${username}`); // Fetch employee details
        setData(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployeeData();
  }, [username]);

  // 🔹 Prevent Back Navigation
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

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('jwtToken'); // Remove token if stored
    console.log("Logged out");
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="dashboard">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <ul>
          <li onClick={() => navigate('/profile')} className="active">
            <i className="icon"></i> Profile
          </li>
          <li onClick={() => navigate('/attendance')}>
            <i className="icon"></i> Attendance
          </li>
          <li onClick={() => navigate('/leave')}>
            <i className="icon"></i> Leave Requests
          </li>
          <li onClick={() => navigate('/empShift')}>
            <i className="icon"></i> Shift Details
          </li>
          <li className="logout-button" onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2>Welcome to Your Employee Dashboard</h2>
        <div className="content">
          <img src="/employee.jpg" alt="Employee Workspace" />
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
  );
};

export default EmployeeDashboard;
