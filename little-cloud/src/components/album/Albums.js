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
import FiltersImages from "./filters/FiltersImages";

function Albums() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [images, setImages] = useState(null);
  const [albumsSort, setAlbumsSort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [funny, setFunny] = useState();
  const [imagesSort, setImagesSort] = useState(null);
  const [showSlide, setShowSlide] = useState(false);
  const [activeSlidePhoto, setActiveSlidePhoto] = useState(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const { albumId } = useParams();

  const [uniqueTags, SetUniqueTags] = useState(null);
  const [AlbumName, SetAlbumName] = useState("");
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const authToken = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (inView && loading) {
      let apiURL;
      if (albumId === undefined) {
        apiURL = "http://localhost:8080/api/albums";
      } else {
        apiURL = `http://localhost:8080/api/album/${albumId}`;
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
        setImages(response.data.zdjeciaDTO);
        setImagesSort(response.data.zdjeciaDTO);
        setAlbums(response.data.kategorieDTO);
        setAlbumsSort(response.data.kategorieDTO);
        getUniqueTags(response.data.zdjeciaDTO);
        SetAlbumName(response.data.nazwaKategorii);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });

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
    console.log(funny);
    window.location.reload();
  };

  const getUniqueTags = (images) => {
    const uniqueValuesSet = new Set();
    images.forEach(image=> {
      image.tags.forEach(tag => {
        uniqueValuesSet.add(tag);
      });
    });

    // Zamiana zbioru na tablicę
    const uniqueValuesArray = [...uniqueValuesSet];

    SetUniqueTags(uniqueValuesArray);
  };

  return (
    <React.Fragment>
      {showSlide ? (
        <Slide
          images={imagesSort}
          activeSlidePhoto={activeSlidePhoto}
          setActiveSlidePhoto={setActiveSlidePhoto}
          showSlide={showSlide}
          setShowSlide={setShowSlide}
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
            setFunny={setFunny}
            parentCategory={albumId}
          />
          <FiltersImages
            images={images}
            imagesSort={imagesSort}
            setImagesSort={setImagesSort}
            setFunny={setFunny}
            uniqueTags={uniqueTags}
            albumName={AlbumName}
          />
          <ImageCollection
            error={error}
            loading={loading}
            images={imagesSort}
            setShowSlide={setShowSlide}
            activeSlidePhoto={activeSlidePhoto}
            setActiveSlidePhoto={setActiveSlidePhoto}
            category={albumId}
          />
        </>
      )}
    </React.Fragment>
  );
}

export default Albums;
