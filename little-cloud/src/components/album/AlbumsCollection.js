import React, { useEffect, useState } from "react";

import Tile from "./tile/Tile";
import TileAddCat from "./tile/TileAddCat";
import Arrow from "../../assets/arrow.svg";
import ArrowUp from "../../assets/arrowUp.svg";

function AlbumsCollection({
  error,
  loading,
  albumsSort,
  handleTileClick,
  forwardedRef,
  showAddCat,
  setShowAddCat,
  setFunny,
  parentCategory,
}) {
  const [showAlbums, setShowAlbums] = useState(true);

  return (
    <div className="Collection" ref={forwardedRef}>
      <div className="Title">
        <div className="Text">Albumy:</div>
        <button
          onClick={() => {
            setShowAlbums(!showAlbums);
          }}
        >
          {showAlbums ? (
            <>
              {"Ukryj albumy"} <img src={ArrowUp} alt="" />
            </>
          ) : (
            <>
              {"Pokaż albumy"} <img src={Arrow} alt="" />
            </>
          )}
        </button>
      </div>
      {showAlbums ? (
        <div className="Tiles">
          {showAddCat ? (
            <TileAddCat
              showAddCat={showAddCat}
              setShowAddCat={setShowAddCat}
              parentCategory={parentCategory}
            />
          ) : null}
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
          ) : !showAddCat ? (
            <p>Ta kategoria jest pusta</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default AlbumsCollection;
