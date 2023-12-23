import React, { useState, useEffect } from "react";
import "./Albums.css";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useParams } from "react-router-dom";

import Filters from "./filters/Filters";
import Slide from "./slides/Slide";
import AlbumsCollection from "./AlbumsCollection";
import ImageCollection from "./ImagesCollection";

function Albums() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [images, setImages] = useState(null);
  const [albumsSort, setAlbumsSort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [funny, setFunny] = useState();
  const [showSlide, setShowSlide] = useState(false);
  const [activeSlidePhoto, setActiveSlidePhoto] = useState(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const { albumId } = useParams();
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (inView && loading) {
      let apiURL;
      if (albumId === undefined) {
        apiURL = "http://localhost:8080/api/albums";
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
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
      } else {
        apiURL = `http://localhost:8080/api/album/${albumId}`;
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
            setImages(response.data.zdjeciaDTO);
            setAlbums(response.data.kategorieDTO);
            setAlbumsSort(response.data.kategorieDTO);
          })
          .catch((error) => {
            setError(error);
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [inView, authToken, loading, albumId]);

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
    <React.Fragment>
      {showSlide ? (
        <Slide
          images={images}
          activeSlidePhoto={activeSlidePhoto}
          setActiveSlidePhoto={setActiveSlidePhoto}
        />
      ) : (
        <>
          <Filters
            albums={albums}
            albumsSort={albumsSort}
            setAlbumsSort={setAlbumsSort}
            setFunny={setFunny}
            showAddCat={showAddCat}
            setShowAddCat={setShowAddCat}
          />
          <AlbumsCollection
            forwardedRef={ref}
            error={error}
            loading={loading}
            albumsSort={albumsSort}
            handleTileClick={handleTileClick}
            showAddCat={showAddCat}
            setShowAddCat={setShowAddCat}
          />
          {albumId !== undefined ? (
            <ImageCollection
              error={error}
              loading={loading}
              images={images}
              setShowSlide={setShowSlide}
              activeSlidePhoto={activeSlidePhoto}
              setActiveSlidePhoto={setActiveSlidePhoto}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </React.Fragment>
  );
}

export default Albums;
