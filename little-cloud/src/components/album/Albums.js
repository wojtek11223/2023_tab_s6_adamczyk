import React, { useState, useEffect } from "react";
import "./Albums.css";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useParams } from "react-router-dom";

import Tile from "./tile/Tile";
import Filters from "./filters/Filters";

const tempAlbums = [
  {
    idKategorii: "3",
    nazwaKategorii: "Kotek",
    id_kat_nadrz: "null",
  },
  {
    idKategorii: "4",
    nazwaKategorii: "Miasto",
    id_kat_nadrz: null,
  },
  {
    idKategorii: "5",
    nazwaKategorii: "Abrakadabra",
    id_kat_nadrz: null,
  },
  {
    idKategorii: "6",
    nazwaKategorii: "Czary Mary",
    id_kat_nadrz: null,
  },
  {
    idKategorii: "7",
    nazwaKategorii: "Zespół",
    id_kat_nadrz: null,
  },
];

function Albums() {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState(null);
  const [images, setImages] = useState(null);
  const [albumsSort, setAlbumsSort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [funny, setFunny] = useState();
  const { albumId } = useParams();
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (inView && loading) {
      let apiURL;
      let apiURLphoto;
      if (albumId === undefined) {
        apiURL = "http://localhost:8080/api/albums";
      } else {
        apiURL = `http://localhost:8080/api/album/${albumId}`;
        apiURLphoto = `http://localhost:8080/api/getAllImages?categoryId=${albumId}`;
        axios({
          url: apiURLphoto,
          method: "get",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            setImages(response.data);
            setImages(response.data);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }

      axios({
        url: apiURL,
        method: "get",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          setAlbums(response.data);
          setAlbumsSort(response.data);
        })
        .catch((error) => {
          console.error(error);
          setAlbums(tempAlbums);
          setAlbumsSort(tempAlbums);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [inView, authToken, loading]);

  useEffect(() => {
    const handlePopstate = () => {
      window.location.reload();
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const handleTileClick = (albumId) => {
    navigate(`/albums/${albumId}`);
    window.location.reload();
  };

  return (
    <>
      <Filters
        albums={albums}
        albumsSort={albumsSort}
        setAlbumsSort={setAlbumsSort}
        setFunny={setFunny}
      />
      <div className="Collection" ref={ref}>
        {loading ? (
          <p>Loading...</p>
        ) : albumsSort && albumsSort.length != 0 ? (
          albumsSort.map((album) => (
            <Tile
              key={album.idKategorii}
              albumName={album.nazwaKategorii}
              onClick={() => handleTileClick(album.idKategorii)}
            ></Tile>
          ))
        ) : (
          <p>Ta kategoria jest pusta</p>
        )}
      </div>
      <div className="Collection">
        {loading && albumId !== undefined ? (
          <p>Loading...</p>
        ) : images && images.length != 0 ? (
          images.map((image) => (
            <Tile
              key={image.zdjecia.idZdjecia}
              albumName={image.zdjecia.nazwa}
              image={image.zdjecia}
              onClick={() => handleTileClick(image.idZdjecia)}
            ></Tile>
          ))
        ) : (
          <p>Nie ma żadnych zdjęć</p>
        )}
      </div>
    </>
  );
}

export default Albums;
