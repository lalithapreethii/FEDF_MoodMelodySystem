import React, { useState } from "react";
import '../styles/Auth.css';

function Signup({ onSignup, goToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSignup({ username, email, password });
  }

  return (
    <div className="auth-background">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={e=>setUsername(e.target.value)} 
            required 
            placeholder="Your username"
          />

          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
            placeholder="your@email.com"
          />

          <label>Password</label>
          <div className="password-row">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
            <span
              className="toggle"
              onClick={() => setShowPassword(s => !s)}
              title={showPassword ? "Hide" : "Show"}
            >{showPassword ? "🙈" : "👁️"}</span>
          </div>
          <button className="dreamy-btn" type="submit">Sign Up</button>
        </form>
        
        <div className="auth-action">
          Already have an account?
          <button className="auth-link" onClick={goToLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
