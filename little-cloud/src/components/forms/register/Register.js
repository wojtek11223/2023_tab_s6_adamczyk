import React from "react";
import "../Form.css";

function Register() {
  return (
    <div className="Container">
      <form className="Form">
        <div className="Text">Zarejestruj się :)</div>
        <div className="InputGroup">
          <input type="text" id="login" required></input>
          <label htmlFor="login">Nazwa użytkownika</label>
        </div>
        <div className="InputGroup">
          <input type="text" id="email" required></input>
          <label htmlFor="email">Adres e-mail</label>
        </div>
        <div className="InputGroup">
          <input type="password" id="password" required></input>
          <label htmlFor="password">Hasło</label>
        </div>
        <div className="InputGroup">
          <input type="password" id="repassword" required></input>
          <label htmlFor="repassword">Powtórz hasło</label>
        </div>
        <div className="Regulations">
          <input type="checkbox" required></input>
          Zaakceptuj regulamin naszej strony
        </div>
        <input type="button" value={"Zarejestruj się"}></input>
      </form>
    </div>
  );
}

export default Register;
