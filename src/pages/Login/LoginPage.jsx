import React, { useEffect, useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../../service/UserService";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap-icons/font/bootstrap-icons.css"; 

const LoginPage = () => {
  // State to store user credentials
  const [user, setUser] = useState({ username: "", password: "" });

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State to handle login errors
  const [error, setError] = useState(false);

  // Hook for navigation redirection
  const navigate = useNavigate();

  // Prevent back navigation after login
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);
    
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  // Handle changes to input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await authenticateUser();
  };

  // Authenticate user credentials and redirect based on role
  const authenticateUser = async () => {
    try {
      const response = await authenticate(user);

      if (response && response.token) {
        localStorage.setItem("jwtToken", response.token);
        localStorage.setItem("username", user.username);
        const decodedToken = jwtDecode(response.token);

        navigate(decodedToken.role === "ROLE_EMPLOYEE" ? "/employee" : "/manager");
      }
    } catch (error) {
      console.error("Error logging in:", error.response?.data || error.message);
      setError(true);
    }
  };

  // Reset form fields and dismiss login error
  const handleTryAgain = () => {
    setUser({ username: "", password: "" });
    setError(false);
  };

  return (
    <div className="whole-login">
      <div className="login-container">
        <div className="login-form">
          <h2 style={{ color: "#372c7f" }}>Login to your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="Enter your username" 
                value={user.username} 
                onChange={handleInputChange} 
              />
            </div>
            
            <label htmlFor="password">Password</label>
            <div className="input-group password-container">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                value={user.password} 
                onChange={handleInputChange} 
                className="form-control" 
              />
              <button type="button" className="btn btn-outline-secondary eye-button" onClick={handleTogglePassword}>
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>

            <button type="submit" className="sign-in-button">Sign In</button>
          </form>
        </div>

        <div className="login-info">
          <img src="/logo.gif" alt="sample" />
        </div>
      </div>

      {/* Pop-up for Incorrect Credentials */}
      {error && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-center">
              <div className="modal-header">
                <h5 className="modal-title">Login Failed ❌</h5>
              </div>
              <div className="modal-body">
                <p>Incorrect username or password. Please try again.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={handleTryAgain}>Try Again</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
