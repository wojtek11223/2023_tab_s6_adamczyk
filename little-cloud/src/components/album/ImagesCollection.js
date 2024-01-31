import React, { useState } from "react";
import Arrow from "../../assets/arrow.svg";
import ArrowUp from "../../assets/arrowUp.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Tile from "./tile/Tile";
import "./ImagesCollection.css"; 

function ImagesCollection({
  error,
  loading,
  images,
  setShowSlide,
  activePhoto,
  setActivePhoto,
  category,
  setShowEditPhoto,
  setShowAddPhoto
}) {
  const [showPhotos, setShowPhotos] = useState(true);

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const handleEditClick = (Photo) => {
    setShowEditPhoto(true);
    setActivePhoto(Photo);
  };

  const handlePhotoClick = (Photo) => {
    setShowSlide(true);
    setActivePhoto(Photo);
  };


  const handleTileDeletePhoto = (Photoid) => {
    const postData = {
      categoryid: category !== undefined ? category : null,
      photoid: Photoid,
    };
    const apiUrl = "http://localhost:8080/api/delete_photo";
    const authToken = sessionStorage.getItem("authToken");
    axios
      .post(apiUrl, postData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        category !== undefined
          ? navigate(`/albums/${category}`)
          : navigate("/albums");
        window.location.reload();
      })
      .catch((error) => {
        setMessage(
          error.response && error.response.data
            ? error.response.data
            : error.message
        );
        console.error(error);
      });
  };

  return (
    <div className="Collection">
      <div className="Title">
        <div className="Text">Zdjęcia:</div>
        <button
          onClick={() => {
            setShowPhotos(!showPhotos);
          }}
        >
          {showPhotos ? (
            <>
              {"Ukryj zdjęcia"} <img src={ArrowUp} alt="" />
            </>
          ) : (
            <>
              {"Pokaż zdjęcia"} <img src={Arrow} alt="" />
            </>
          )}
        </button>
      </div>
      {showPhotos ? (
        <div className="Tiles">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error.message}</p>
          ) : images && images.length !== 0 ? (
            images.map((image, index) => (
              <React.Fragment key={image.idZdjecia}>
                <Tile
                  key={image.idZdjecia}
                  albumName={image.nazwa.split(".")[0]}
                  image={image}
                  onClick={() => handlePhotoClick(image)}
                  handleEditClick={() => handleEditClick(image)}
                  handleDeletePhotoClick={() => handleTileDeletePhoto(image.idZdjecia)}
                  
                ></Tile>

              </React.Fragment>
            ))
          ) : (
            <p>Nie ma żadnych zdjęć</p>
          )}
          <button
            className="add-photo-button"
            onClick={()=>setShowAddPhoto(true)}
          >
            +
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ImagesCollection;
