import React, { useState, useEffect, useRef } from "react";
import "./Filters.css";
import Search from "../../../assets/search.svg";
import Arrow from "../../../assets/arrow.svg";

function Filters() {
  const [selectedOption, setSelectedOption] = useState("Sortowanie");
  const [showOptions, setShowOptions] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    function handler(e) {
      if (menuRef && !menuRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className="Filters">
      <div className="SearchInput">
        <img src={Search} alt=""></img>
        <input type="text" placeholder="Wyszukaj po nazwie" />
      </div>
      <div className="SelectMenu" ref={menuRef}>
        <div className="SelectCont">
          <button
            className="SelectButton"
            onClick={() => {
              setShowOptions(!showOptions);
            }}
          >
            {selectedOption}
            <img src={Arrow} alt="" />
          </button>

          <ul className={`SelectList ${showOptions ? "active" : "inactive"}`}>
            <li onClick={(e) => setSelectedOption(e.target.innerHTML)}>
              Domyślnie
            </li>
            <li onClick={(e) => setSelectedOption(e.target.innerHTML)}>
              Alfabetycznie rosnąco
            </li>
            <li onClick={(e) => setSelectedOption(e.target.innerHTML)}>
              Alfabetycznie malejąco
            </li>
            <li onClick={(e) => setSelectedOption(e.target.innerHTML)}>
              Rzecz
            </li>
            <li onClick={(e) => setSelectedOption(e.target.innerHTML)}>
              Banan
            </li>
            <li onClick={(e) => setSelectedOption(e.target.innerHTML)}>
              Pomarańcza
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Filters;
