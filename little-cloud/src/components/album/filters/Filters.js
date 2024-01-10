import React, { useState, useEffect, useRef } from "react";
import "./Filters.css";
import Search from "../../../assets/search.svg";
import Arrow from "../../../assets/arrow.svg";
import ArrowUp from "../../../assets/arrowUp.svg";

function Filters({
  albums,
  albumsSort,
  setAlbumsSort,
  setFunny,
  showAddCat,
  setShowAddCat,
}) {
  const [selectedOption, setSelectedOption] = useState("Sortowanie");
  const [showOptions, setShowOptions] = useState(false);
  const [searchText, setSearchText] = useState("");

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
  }, [menuRef]);

  useEffect(() => {
    if (searchText) {
      let newAlbums = albums.filter((album) => {
        if (
          album.nazwaKategorii
            .toLowerCase()
            .startsWith(searchText.toLowerCase())
        ) {
          return album;
        }
      });
      setAlbumsSort(newAlbums);
    } else {
      setAlbumsSort(albums);
    }
  }, [searchText]);

  const defaultSort = () => {
    const sortedAlbums = albumsSort.sort(
      (a, b) => a.idKategorii - b.idKategorii
    );
    setAlbumsSort(sortedAlbums);
    setFunny(0);
  };

  const handleSort = () => {
    const sortedAlbums = albumsSort.sort((a, b) =>
      a.nazwaKategorii.localeCompare(b.nazwaKategorii)
    );
    setAlbumsSort(sortedAlbums);
    setFunny(1);
  };

  const handleSortRe = () => {
    const sortedAlbums = albumsSort.sort((a, b) =>
      b.nazwaKategorii.localeCompare(a.nazwaKategorii)
    );
    setAlbumsSort(sortedAlbums);
    setFunny(2);
  };

  function AddCategory() {
    if (!showAddCat) {
      setShowAddCat((showAddCat) => true);
    }
  }

  return (
    <div className="Filters">
      <div className="AddCategory">
        <button onClick={AddCategory} disabled={showAddCat}>
          +
        </button>
      </div>
      <div className="SearchInput">
        <img src={Search} alt=""></img>
        <input
          type="text"
          placeholder="Wyszukaj po nazwie"
          onChange={(e) => setSearchText(e.target.value)}
        />
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
            <img src={showOptions ? ArrowUp : Arrow} alt="" />
          </button>

          <ul className={`SelectList ${showOptions ? "active" : "inactive"}`}>
            <li
              onClick={(e) => {
                setSelectedOption(e.target.innerHTML);
                defaultSort();
              }}
            >
              Domyślnie
            </li>
            <li
              onClick={(e) => {
                setSelectedOption(e.target.innerHTML);
                handleSort();
              }}
            >
              Alfabetycznie rosnąco
            </li>
            <li
              onClick={(e) => {
                setSelectedOption(e.target.innerHTML);
                handleSortRe();
              }}
            >
              Alfabetycznie malejąco
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Filters;
