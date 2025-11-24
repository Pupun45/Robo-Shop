import React, { useState } from "react";
import "../App.css"

const LoginSignup = ({ onClose }) => {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  return (
    <div className="popup-overlay" onClick={(e) => e.target.classList.contains("popup-overlay") && onClose()}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose}>
          ✕
        </button>

        <div
          className={`log-auth-container-wrapper ${
            rightPanelActive ? "log-right-panel-active" : ""
          }`}
          id="container"
        >
          {/* Sign In Form */}
          <div className="log-auth-form-panel log-panel-signin">
            <div className="log-form-box">
              <h1 className="log-heading-xl">Sign in</h1>
              <input type="email" placeholder="Email" className="log-input-field" />
              <input type="password" placeholder="Password" className="log-input-field" />
              <button className="log-btn">Sign In</button>
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="log-auth-form-panel log-panel-signup">
            <div className="log-form-box">
              <h1 className="log-heading-xl">Create Account</h1>
              <input type="text" placeholder="Name" className="log-input-field" />
              <input type="email" placeholder="Email" className="log-input-field" />
              <input type="password" placeholder="Password" className="log-input-field" />
              <button className="log-btn">Sign Up</button>
            </div>
          </div>

          {/* Overlay Section */}
          <div className="log-auth-overlay-wrapper">
            <div className="log-auth-overlay">
              <div className="log-auth-overlay-panel log-auth-overlay-left">
                <h1 className="log-heading-xl">Welcome Back!</h1>
                <p className="log-text-para">
                  To stay connected with us, please login with your info
                </p>
                <button
                  className="log-btn log-ghost-btn"
                  onClick={() => setRightPanelActive(false)}
                >
                  Sign In
                </button>
              </div>

              <div className="log-auth-overlay-panel log-auth-overlay-right">
                <h1 className="log-heading-xl">Hello, Friend!</h1>
                <p className="log-text-para">
                  Enter your personal details and start your journey with us
                </p>
                <button
                  className="log-btn log-ghost-btn"
                  onClick={() => setRightPanelActive(true)}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
