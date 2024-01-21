import React, { useState, useEffect, useRef } from "react";
import "./Filters.css";
import Search from "../../../assets/search.svg";
import Arrow from "../../../assets/arrow.svg";
import JSZip from "jszip";
import axios from "axios";
import ArrowUp from "../../../assets/arrowUp.svg";
import Download from "../../../assets/download.svg";

function FiltersImages({
  images,
  imagesSort,
  setImagesSort,
  setFunny,
  uniqueTags,
  albumName,
}) {
  const [selectedOption, setSelectedOption] = useState("Domyślnie");
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuTags, setShowMenuTags] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [checkedTags, setCheckedTags] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  let menuRef = useRef();
  let menuTagRef = useRef();

  useEffect(() => {
    function handler(e) {
      if (menuRef && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [menuRef]);

  useEffect(() => {
    function handler(e) {
      if (menuTagRef && !menuTagRef.current.contains(e.target)) {
        setShowMenuTags(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [menuTagRef]);

  const handleCheckboxChange = (value) => {
    if (checkedTags.includes(value)) {
      setCheckedTags(checkedTags.filter((item) => item !== value));
    } else {
      setCheckedTags([...checkedTags, value]);
    }
  };

  const downloadImagesAsZip = async () => {
    const zip = new JSZip();
    let textContent =
      "Nazwa zdjęcia | typ | data wykonania | wymiar | rozmiar\n";
    const dataMap = new Map();
    try {
      for (const image of imagesSort) {
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
        const currentCount = dataMap.get(response.data.nazwa) || 0;
        const newCount = currentCount + 1;
        dataMap.set(response.data.nazwa, newCount);
        const byteCharacters = atob(response.data.zdjecie);

        const byteNumbers = new Array(byteCharacters.length);
        const data = new Date(response.data.dataWykonania);

        const opcjeFormatowania = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };
        const stringData = data.toLocaleString(undefined, opcjeFormatowania);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: response.data.format });
        textContent += `${
          currentCount === 0
            ? response.data.nazwa.split(".")[0]
            : `${response.data.nazwa.split(".")[0]} (${currentCount})`
        } | ${response.data.format} | ${stringData} | ${response.data.height}x${
          response.data.width
        } | ${blob.size / 1000} KB\n`;

        // Dodaj obraz do archiwum
        zip.file(
          currentCount === 0
            ? response.data.nazwa
            : `${response.data.nazwa.split(".")[0]} (${currentCount}).${
                response.data.nazwa.split(".")[1]
              }`,
          blob
        );
      }
      if (checkedTags.length !== 0) {
        textContent += "\n Filtrowane po tagach: ";
        checkedTags.forEach((tag) => {
          textContent += `${tag} `;
        });
      }
      if (searchText !== "") {
        textContent += `\n\n Zaczynające się na ${searchText}`;
      }
      if (albumName) {
        textContent += `\n\n Zdjęcia znajdują się w kategorii: ${albumName}`;
      }
      if (dateTo && dateFrom) {
        textContent += `\n Od ${dateFrom} do ${dateTo}`;
      } else if (dateTo) {
        textContent += `\n Do ${dateTo}`;
      } else if (dateFrom) {
        textContent += `\n Od ${dateFrom}`;
      }
      zip.file("raport.txt", textContent);

      // Utwórz plik .zip
      const content = await zip.generateAsync({ type: "blob" });

      // Utwórz element <a> i ustaw atrybuty
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "images.zip";
      document.body.appendChild(link);

      // Symuluj kliknięcie w link
      link.click();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  //filtracja po tagach
  useEffect(() => {
    let img = images;
    img = checkedTagsFilter(img);
    img = searchTextFilter(img);
    img = imagesSorted(img);
    img = DateFilter(img);
    setImagesSort(img);
    setFunny(Math.random());
  }, [checkedTags, searchText, selectedOption, dateTo, dateFrom]);

  const searchTextFilter = (img) => {
    if (searchText) {
      let newimages = img.filter((image) => {
        if (image.nazwa.toLowerCase().startsWith(searchText.toLowerCase())) {
          return img;
        }
      });
      return newimages;
    } else {
      return img;
    }
  };

  const DateFilter = (img) => {
    let newimages;
    const dateOD = new Date(dateFrom);
    const dateDO = new Date(dateTo);
    let formatOd = Math.floor(dateOD.getTime());
    let formatDo = Math.floor(dateDO.getTime());

    if (!dateTo && !dateFrom) {
      return img;
    } else if (!dateFrom && dateTo) {
      newimages = img.filter((image) => image.dataWykonania <= formatDo);
    } else if (dateFrom && !dateTo) {
      newimages = img.filter((image) => image.dataWykonania >= formatOd);
    } else {
      if (formatOd > formatDo) {
        setDateTo(dateFrom);
        setDateFrom(dateTo);
        let temp;
        temp = formatOd;
        formatOd = formatDo;
        formatDo = temp;
      }
      newimages = img.filter(
        (image) =>
          image.dataWykonania >= formatOd && image.dataWykonania <= formatDo
      );
    }

    return newimages;
  };

  const imagesSorted = (img) => {
    if (img !== null) {
      if (selectedOption === "Alfabetycznie malejąco") {
        return handleSortRe(img);
      } else if (selectedOption === "Alfabetycznie rosnąco") {
        return handleSort(img);
      } else if (selectedOption === "Daty wykonania rosnąco") {
        return handleDateSort(img);
      } else if (selectedOption === "Daty wykonania malejąco") {
        return handleDateSortRe(img);
      } else {
        return defaultSort(img);
      }
    }
  };

  const checkedTagsFilter = (img) => {
    if (checkedTags.length !== 0) {
      let sortedImagesByTags = img.filter((image) => {
        return checkedTags.some((word) => image.tags.includes(word));
      });
      return sortedImagesByTags;
    } else {
      return img;
    }
  };
  const defaultSort = (img) => {
    const sortedimages = img.sort((a, b) => a.idZdjecia - b.idZdjecia);
    return sortedimages;
  };

  const handleDateSort = (img) => {
    const sortedimages = img.sort((a, b) => a.idZdjecia - b.idZdjecia);
    return sortedimages;
  };

  const handleDateSortRe = (img) => {
    const sortedimages = img.sort((a, b) => b.idZdjecia - a.idZdjecia);
    return sortedimages;
  };
  const handleSort = (img) => {
    const sortedimages = img.sort((a, b) => a.nazwa.localeCompare(b.nazwa));
    return sortedimages;
  };

  const handleSortRe = (img) => {
    const sortedimages = img.sort((a, b) => b.nazwa.localeCompare(a.nazwa));
    return sortedimages;
  };

  return (
    <div className="Filters">
      {images && images.length !== 0 ? (
        <div className="DownloadZip">
          <button onClick={downloadImagesAsZip}>
            <img src={Download} />
          </button>
        </div>
      ) : (
        <></>
      )}

      <div className="SelectMenuTags" ref={menuTagRef}>
        <button
          className="SelectButton"
          onClick={() => {
            setShowMenuTags(!showMenuTags);
          }}
        >
          {"Tagi"}
          <img src={showMenuTags ? ArrowUp : Arrow} alt="" />
        </button>

        <ul className={`SelectList ${showMenuTags ? "active" : "inactive"}`}>
          {uniqueTags &&
            uniqueTags.length !== 0 &&
            uniqueTags.map((item) => (
              <li key={item} onClick={() => handleCheckboxChange(item)}>
                <input
                  type="checkbox"
                  checked={checkedTags.includes(item)}
                  onChange={() => handleCheckboxChange(item)}
                />
                {item.toLowerCase()}
              </li>
            ))}
        </ul>
      </div>
      <div className="Dates">
        <div className="Date From">
          <div className="InputField">
            <label>Od:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
        </div>

        <div className="Date To">
          <div className="InputField">
            <label>Do: </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
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
        <button
          className="SelectButton"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          {selectedOption}
          <img src={showMenu ? ArrowUp : Arrow} alt="" />
        </button>

        <ul className={`SelectList ${showMenu ? "active" : "inactive"}`}>
          <li
            onClick={(e) => {
              setSelectedOption(e.target.innerHTML);
            }}
          >
            Domyślnie
          </li>
          <li
            onClick={(e) => {
              setSelectedOption(e.target.innerHTML);
            }}
          >
            Alfabetycznie rosnąco
          </li>
          <li
            onClick={(e) => {
              setSelectedOption(e.target.innerHTML);
            }}
          >
            Alfabetycznie malejąco
          </li>
          <li
            onClick={(e) => {
              setSelectedOption(e.target.innerHTML);
            }}
          >
            Daty wykonania malejąco
          </li>
          <li
            onClick={(e) => {
              setSelectedOption(e.target.innerHTML);
            }}
          >
            Daty wykonania rosnąco
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FiltersImages;
