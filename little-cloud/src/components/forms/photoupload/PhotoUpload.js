
import React, { useState, useEffect } from "react";

import axios from "axios";
import "../Form.css";
import ProgressBar from "./ProgressBar/ProgressBar";

const PhotoUploadForm = () => {
  const [file, setFile] = useState(null);
  const [nazwa, setNazwa] = useState("");
  const [dataWykonania, setDataWykonania] = useState("");
  const [kategoriaID, setKategoriaID] = useState("");
  const [Tag, setTag] = useState("");
  const [message, setMessage] = useState("");
  const [progressBar, setProgressBar] = useState(null);

  const getImageInfoFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = new Image();

        image.onload = () => {
          const resolution = { width: image.width, height: image.height };
          const format = file.type.replace("image/", "");

          // Zamyka obraz, aby zwolnić zasoby
          URL.revokeObjectURL(image.src);

          // Zwraca informacje
          resolve({ resolution, format });
        };

        image.onerror = (error) => {
          reject(error);
        };

        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
  const handleFileChange = (e) => {
    setProgressBar(0);
    setMessage(null);
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Automatically populate the "nazwa" field with the file name
    if (selectedFile) {
      setNazwa(selectedFile.name);
    }
  };
  useEffect(() => {
    const handlePopstate = () => {
      window.location.reload();
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };

  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    debugger;
    const jwtToken = sessionStorage.getItem("authToken");
    getImageInfoFromFile(file).then((info) => {
      const postZdjecieDTO = {
        file: file,
        nazwa: nazwa,
        wysokosc: info.resolution.height,
        szerokosc: info.resolution.width,
        dataWykonania: dataWykonania,
        nazwaKategorii: kategoriaID,
        tagi: Tag
      };
        return axios.post(
          "http://localhost:8080/api/photo_upload",
          postZdjecieDTO,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "*/*",
              Authorization: `Bearer ${jwtToken}`,
              Accept: "*/*",
            },
            onUploadProgress: (e) => {
              setProgressBar(Math.round(100 * e.loaded) / e.total);
            },
          }
        );
      })
      .then((response) => {
        setMessage(
          response.data !== undefined
            ? response.data
            : "File uploaded successfully"
        );
      })
      .catch((error) => {
        setMessage(
          error.response.data !== undefined
            ? error.response.data
            : "Error uploading file"
        );
        console.error("Error uploading file:", error);
      });
  };

  return (
    <>
      <ProgressBar progressBar={progressBar} />
      <div className="Container">
        <form className="Form" onSubmit={handleSubmit}>
          <div className="Text">
            Dodaj zdjęcie {message && <p>{message}</p>}
          </div>

          <div className="InputGroup">
            <div className="InputField">
              <label>Zdjęcie: </label>
              <input type="file" onChange={handleFileChange} accept="image/*" />
            </div>
          </div>


          <div className="InputGroup">
            <div className="InputField">
              <label>Data Wykonania:</label>
              <input
                style={{ color: "black" }}
                type="date"
                accept="image/*"
                value={dataWykonania}
                onChange={(e) => setDataWykonania(e.target.value)}
              />
            </div>
          </div>
          <div className="InputGroup">
            <div className="InputField">
              <label>Nazwa kategorii:</label>
              <input
                style={{ color: "black" }}
                type="text"
                value={kategoriaID}
                onChange={(e) => setKategoriaID(e.target.value)}
              />
            </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label>Tagi:</label>
            <input
              style={{ color: "black" }}
              type="text"
              value={Tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <input type="submit" value="Prześlij zdjęcie" />
          </div>
        </div>
        </form>
      </div>
    </>
  );
};

export default PhotoUploadForm;
