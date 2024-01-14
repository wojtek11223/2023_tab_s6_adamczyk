import React, { useState } from "react";
import Arrow from "../../assets/arrow.svg";
import ArrowUp from "../../assets/arrowUp.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Tile from "./tile/Tile";

function ImagesCollection({
  error,
  loading,
  images,
  setShowSlide,
  activeSlidePhoto,
  setActiveSlidePhoto,
  category
}) {
  const [showPhotos, setShowPhotos] = useState(true);

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const handleTileClickPhoto = (Photo) => {
    setShowSlide(true);
    setActiveSlidePhoto(Photo);
  };

  const handleTileDeletePhot = (Photoid) => {
    const postData = {
      categoryid: category,
      photoid: Photoid !== undefined ? Photoid: null,
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
        category !== undefined ? navigate(`/albums/${category}`) : navigate('/albums');
        window.location.reload();
      })
      .catch((error) => {
        setMessage(error.response && error.response.data ? error.response.data : error.message);
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
            images.map((image) => (
              <React.Fragment key={image.idZdjecia}>
                <Tile
                  key={image.idZdjecia}
                  albumName={image.nazwa.split(".")[0]}
                  image={image}
                  onClick={() => handleTileClickPhoto(image)}
                ></Tile>
              </React.Fragment>
            ))
          ) : (
            <p>Nie ma żadnych zdjęć</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ImagesCollection;
