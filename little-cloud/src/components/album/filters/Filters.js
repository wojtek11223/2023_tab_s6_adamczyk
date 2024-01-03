import React, { useState, useEffect, useRef } from "react";
import "./Filters.css";
import Search from "../../../assets/search.svg";
import Arrow from "../../../assets/arrow.svg";
import JSZip from 'jszip';
import axios from "axios";

function Filters({ albums, albumsSort, setAlbumsSort, setFunny, images }) {
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

  const downloadImagesAsZip = async () => {
    const zip = new JSZip();
    let textContent = 'Nazwa zdjęcia | typ | data wykonania | wymiar | rozmiar\n';
    
    try {
      for (const image of images) {
        const authToken = sessionStorage.getItem("authToken");
        const response = await axios({
          url: `http://localhost:8080/api/photo/${image.idZdjecia}`,
          method: "get",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        });
  
        const byteCharacters = atob(response.data.zdjecie);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: response.data.format });
        textContent +=
          `${response.data.nazwa} | ${response.data.format} | ${response.data.dataWykonania} | ${response.data.height}x${response.data.width} | | ${blob.size/1000} KB\n`;
  
        // Dodaj obraz do archiwum
        zip.file(image.nazwa, blob);
      }
  
      zip.file('raport.txt', textContent);
  
      // Utwórz plik .zip
      const content = await zip.generateAsync({ type: 'blob' });
  
      // Utwórz element <a> i ustaw atrybuty
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'images.zip';
      document.body.appendChild(link);
  
      // Symuluj kliknięcie w link
      link.click();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

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

  //posłuży nam do filtracji zdjęć na podstawie tagów
  const filterImagesByTags = (targetTags) => {
    return images.filter(innerList => {
      return targetTags.some(word => innerList.includes(word));
    });
  };
  return (
    <div className="Filters">
      {images &&  images.length != 0 ?
        <button style={{ color: "black" }} onClick={downloadImagesAsZip}>Pobierz obrazy jako ZIP</button>
        : <></>
      }
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
            <img src={Arrow} alt="" />
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
