import React from "react";
import { useNavigate } from "react-router-dom";

import Tile from "./tile/Tile";

function ImagesCollection({
  error,
  loading,
  images,
  setShowSlide,
  activeSlidePhoto,
  setActiveSlidePhoto,
}) {
  const handleTileClickPhoto = (Photo) => {
    setShowSlide(true);
    setActiveSlidePhoto(Photo);
  };

  return (
    <div className="Collection">
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
  );
}

export default ImagesCollection;
