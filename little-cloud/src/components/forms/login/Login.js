import React from "react";
import "../Form.css";

function Login() {
  return (
    <div className="Container">
      <form className="Form">
        <div className="Text">Zaloguj się :)</div>
        <div className="InputGroup">
          <input type="text" id="login" required></input>
          <label htmlFor="login">Login</label>
        </div>
        <div className="InputGroup">
          <input type="password" id="password" required></input>
          <label htmlFor="password">Hasło</label>
        </div>
        <input type="button" value={"Zaloguj się"}></input>
      </form>
    </div>
  );
}

export default Login;
