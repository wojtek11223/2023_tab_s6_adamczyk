import React, { useEffect } from "react";

import Tile from "./tile/Tile";
import TileAddCat from "./tile/TileAddCat";

function AlbumsCollection({
  error,
  loading,
  albumsSort,
  handleTileClick,
  forwardedRef,
  showAddCat,
  setShowAddCat,
  setFunny,
  parentCategory
}) {
  useEffect(() => {
    if (showAddCat) {
      const handleEsc = (event) => {
        if (event.key === "Escape") {
          setShowAddCat(false);
        }
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [showAddCat]);

  return (
    <div className="Collection" ref={forwardedRef}>
      {showAddCat ? <TileAddCat showAddCat={showAddCat} parentCategory={parentCategory} /> : null}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : albumsSort && albumsSort.length !== 0 ? (
        albumsSort.map((album) => (
          <Tile
            key={album.idKategorii}
            albumName={album.nazwaKategorii}
            onClick={() => handleTileClick(album.idKategorii)}
          ></Tile>
        ))
      ) : showAddCat ? null : (
        <p>Ta kategoria jest pusta</p>
      )}
    </div>
  );
}

export default AlbumsCollection;
