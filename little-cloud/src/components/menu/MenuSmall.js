import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MenuSmall.css";

function MenuSmall({ authName, handleClick }) {
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  const [showRightMenu, setShowRightMenu] = useState(false);

  let leftMenu = useRef();
  let rightMenu = useRef();

  useEffect(() => {
    function handler(e) {
      if (leftMenu && !leftMenu.current.contains(e.target)) {
        setShowLeftMenu(false);
      }
      if (rightMenu && !rightMenu.current.contains(e.target)) {
        setShowRightMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [leftMenu, rightMenu]);

  return (
    <div className="MenuSmall">
      <div className="LeftSelectMenu" ref={leftMenu}>
        <button
          className="Select"
          onClick={() => setShowLeftMenu(!showLeftMenu)}
        >
          Menu
        </button>
        <ul className={`List ${showLeftMenu ? "active" : "inactive"}`}>
          {authName == null ? (
            <>
              <li>
                <Link to="/mainpage">
                  <button>Strona główna</button>
                </Link>
              </li>
              <li>
                <button onClick={handleClick}>Chmurka</button>
              </li>
              <li>
                <Link to="/help">
                  <button>Pomoc</button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/mainpage">
                  <button>Strona główna</button>
                </Link>
              </li>
              <li>
                <Link to="/albums">
                  <button>Albumy</button>
                </Link>
              </li>
              <li>
                <button onClick={handleClick}>Chmurka</button>
              </li>
              <li>
                <Link to="/help">
                  <button>Pomoc</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="RightSelectMenu" ref={rightMenu}>
        <button
          className="Select"
          onClick={() => setShowRightMenu(!showRightMenu)}
        >
          {authName ? `Witaj ${authName}` : `Logowanie/Rejestracja`}
        </button>
        <ul className={`List ${showRightMenu ? "active" : "inactive"}`}>
          {authName == null ? (
            <>
              <li>
                <Link to="/login">
                  <button>Zaloguj się</button>
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <button>Zarejestruj się</button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile">
                  <button>Edycja profilu</button>
                </Link>
              </li>
              <li>
                <Link to="/logout">
                  <button>Wyloguj się</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default MenuSmall;
