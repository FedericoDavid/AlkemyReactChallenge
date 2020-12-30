import React from "react";
import "./Nav.css";

function Nav() {
  return (
    <div className="navbar">
      <div className="Logo">
        <h2>Budget</h2>
      </div>
      <div className="nav">
        <ul>
          <li>New In/Out</li>
          <li>Login</li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
