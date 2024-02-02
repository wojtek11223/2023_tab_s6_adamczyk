
import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import "../Form.css";
import ProgressBar from "./ProgressBar/ProgressBar";
import { useNavigate } from "react-router-dom";



const PhotoUploadForm = ({showAddPhoto, setShowAddPhoto, AlbumName, category}) => {
  const currentDate = new Date();
  const [file, setFile] = useState(null);
  const [nazwa, setNazwa] = useState("");
  const [dataWykonania, setDataWykonania] = useState(currentDate.toISOString().split('T')[0]);
  const [kategoriaID, setKategoriaID] = useState(AlbumName !== undefined ? AlbumName : "");
  const [Tag, setTag] = useState("");
  const [message, setMessage] = useState("");
  const [progressBar, setProgressBar] = useState(null);
  let addForm = useRef();
  const navigate = useNavigate();
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
    if (showAddPhoto) {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          setShowAddPhoto(false);
        }
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [showAddPhoto, setShowAddPhoto]);

  useEffect(() => {
    function handler(e) {
      if (addForm && !addForm.current.contains(e.target)) {
        setShowAddPhoto(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [addForm]);

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
    if(file) {
      getImageInfoFromFile(file).then((info) => {
        const postZdjecieDTO = {
          file: file,
          nazwa: nazwa,
          wysokosc: info.resolution.height,
          szerokosc: info.resolution.width,
          dataWykonania: dataWykonania,
          nazwaKategorii: kategoriaID ? kategoriaID : "",
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
          category !== undefined
          ? navigate(`/albums/${category}`)
          : navigate("/albums");
          window.location.reload();
        })
        .catch((error) => {
          setMessage(
            error.response.data !== undefined
            ? error.response.data
            : "Error uploading file"
          );
          console.error("Error uploading file:", error);
        });
    }
    else {
      setMessage("Dodaj zdjęcie");
    }
  };

  return (
    <>
      <ProgressBar progressBar={progressBar} />
      <div className="BlurAll">
        <form className="Form" onSubmit={handleSubmit} ref={addForm}>
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
                defaultValue={AlbumName ? AlbumName : ""}
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
