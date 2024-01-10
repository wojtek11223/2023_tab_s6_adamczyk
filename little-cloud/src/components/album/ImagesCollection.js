import React, { useState } from "react";
import Arrow from "../../assets/arrow.svg";
import ArrowUp from "../../assets/arrowUp.svg";

import Tile from "./tile/Tile";

function ImagesCollection({
  error,
  loading,
  images,
  setShowSlide,
  activeSlidePhoto,
  setActiveSlidePhoto,
}) {
  const [showPhotos, setShowPhotos] = useState(true);

  const handleTileClickPhoto = (Photo) => {
    setShowSlide(true);
    setActiveSlidePhoto(Photo);
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
              <Tile
                key={image.idZdjecia}
                albumName={image.nazwa}
                image={image}
                onClick={() => handleTileClickPhoto(image)}
              ></Tile>
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
