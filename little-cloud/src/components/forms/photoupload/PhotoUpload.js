import React, { useState } from "react";
import axios from "axios";
import "../Form.css";

const PhotoUploadForm = () => {
  const [file, setFile] = useState(null);
  const [nazwa, setNazwa] = useState("");
  const [dataWykonania, setDataWykonania] = useState("");
  const [kategoriaID, setKategoriaID] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Automatically populate the "nazwa" field with the file name
    if (selectedFile) {
      setNazwa(selectedFile.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    debugger;
    const jwtToken = sessionStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("nazwa", nazwa);
    formData.append("dataWykonania", dataWykonania);
    formData.append("nazwaKategorii", kategoriaID);

    axios
      .post("http://localhost:8080/api/photo_upload", formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: "*/*"
        },
      })
      .then(() => {
        setMessage("File uploaded successfully");
      })
      .catch((error) => {
        setMessage("Error uploading file");
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div className="Container">
      <form className="Form" onSubmit={handleSubmit}>
        <div className="Text">Dodaj zdjęcie {message && <p>{message}</p>}</div>

        <div className="InputGroup">
          <div className="InputField">
            <label>Zdjęcie: </label>
            <input type="file" onChange={handleFileChange} />
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
              value={kategoriaID}
              onChange={(e) => setKategoriaID(e.target.value)}
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
  );
};

export default PhotoUploadForm;
