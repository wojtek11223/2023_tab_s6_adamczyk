import React from "react";
import "./Menu.css";

function Menu() {
  return (
    <React.Fragment>
      <div className="Menu">
        <ul className="Left">
          <li>
            <a href="">Strona główna</a>
          </li>
          <li>
            <a href="/albums">Albumy</a>
          </li>
        </ul>
        <ul className="Right">
          <li>
            <a href="/register">Zarejestruj się</a>
          </li>
          <li>
            <a href="/login">Zaloguj się</a>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}

export default Menu;
