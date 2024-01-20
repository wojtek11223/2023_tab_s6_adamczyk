import React, { useState, useEffect } from "react";
import "./Slide.css";
import Chmurka from "../../../assets/Kot.jpg";
import Close from "../../../assets/close.svg";
import { useInView } from "react-intersection-observer";
import exifr from "exifr";
import axios from "axios";

function Slide({
  images,
  activePhoto,
  setActivePhoto,
  showSlide,
  setShowSlide,
}) {
  const [exifData, setExifData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slidePhoto, setSlidePhoto] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  useEffect(() => {
    if (showSlide) {
      const handleLeftArrow = (e) => {
        if (e.key === "ArrowLeft") {
          handleArrowLeftClick();
        }
      };
      window.addEventListener("keydown", handleLeftArrow);

      return () => {
        window.removeEventListener("keydown", handleLeftArrow);
      };
    }
  }, [activePhoto]);

  useEffect(() => {
    if (showSlide) {
      const handleLeftArrow = (e) => {
        if (e.key === "ArrowRight") {
          handleArrowRightClick();
        }
      };
      window.addEventListener("keydown", handleLeftArrow);

      return () => {
        window.removeEventListener("keydown", handleLeftArrow);
      };
    }
  }, [activePhoto]);

  const handleArrowRightClick = async () => {
    setLoading(true);
    let index = images.indexOf(activePhoto, 0) + 1;
    if (index > images.length - 1) {
      index = 0;
    }
    setActivePhoto(images[index]);
    getPhoto(images[index].idZdjecia);

    console.log(index);
  };

  const handleArrowLeftClick = async () => {
    setLoading(true);
    let index = images.indexOf(activePhoto, 0) - 1;
    if (index < 0) {
      index = images.length - 1;
    }
    setActivePhoto(images[index]);
    getPhoto(images[index].idZdjecia);

    console.log(index);
  };

  const readExifData = async (base64String) => {
    try {
      const data = await exifr.parse(base64String, { exif: true });
      setExifData(data);
    } catch (error) {
      console.error("Błąd podczas odczytywania danych Exif:", error);
    }
  };

  useEffect(() => {
    if (inView) {
      let index = images.indexOf(activePhoto, 0);
      setActivePhoto(images[index]);
      getPhoto(images[index].idZdjecia);
    }
  }, [inView, activePhoto, images, setActivePhoto]);
  const getPhoto = (photoId) => {
    const authToken = sessionStorage.getItem("authToken");
    axios({
      url: `http://localhost:8080/api/photo/${photoId}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setSlidePhoto(response.data);
        readExifData(response.data.zdjecie);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (showSlide) {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          setShowSlide(false);
        }
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [showSlide, setShowSlide]);

  return (
    <div className="SlideContainer">
      <div className="Slide" ref={ref}>
        <button onClick={() => setShowSlide((showSlide) => !showSlide)}>
          <img src={Close} />
        </button>
        <div className="ArrowLeft" onClick={handleArrowLeftClick}>
          <div className="Arrow"></div>
        </div>
        {loading ? (
          <p>Loading</p>
        ) : (
          <>
            {error ? (
              error.status
            ) : (
              <div className="Picture">
                <img
                  src={
                    slidePhoto
                      ? `data:${slidePhoto.format};base64,${slidePhoto.zdjecie}`
                      : Chmurka
                  }
                  alt=""
                />
              </div>
            )}
          </>
        )}
        <div className="ArrowRight" onClick={handleArrowRightClick}>
          <div className="Arrow"></div>
        </div>
      </div>
      <div className="Exif">
        <div className="Text">EXIF Data:</div>
        {exifData && (
          <table className="Content">
            <tbody>
              {Object.keys(exifData).map((key, index) => (
                <React.Fragment key={index}>
                  {typeof exifData[key] === "string" ? (
                    <tr>
                      <th className="TableCategory">{key}</th>
                      <th className="TableData">{exifData[key].toString()}</th>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Slide;
