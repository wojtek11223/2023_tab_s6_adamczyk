import React, { useState, useEffect } from "react";
import "./Slide.css";
import Chmurka from "../../../assets/Kot.jpg";
import Close from "../../../assets/close.svg";
import { useInView } from "react-intersection-observer";
import exifr from "exifr";
import axios from "axios";

function Slide({
  images,
  activeSlidePhoto,
  setActiveSlidePhoto,
  showSlide,
  setShowSlide,
}) {
  console.log(activeSlidePhoto);
  const [exifData, setExifData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slidePhoto, setSlidePhoto] = useState(null);
  const [message, setMessage] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const handleArrowRightClick = async () => {
    setLoading(true);
    let index = images.indexOf(activeSlidePhoto, 0) + 1;
    if (index > images.length - 1) {
      index = 0;
    }
    setActiveSlidePhoto(images[index]);
    getPhoto(images[index].idZdjecia);

    console.log(index);
  };

  const handleArrowLeftClick = async () => {
    setLoading(true);
    let index = images.indexOf(activeSlidePhoto, 0) - 1;
    if (index < 0) {
      index = images.length - 1;
    }
    setActiveSlidePhoto(images[index]);
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
      let index = images.indexOf(activeSlidePhoto, 0);
      setActiveSlidePhoto(images[index]);
      getPhoto(images[index].idZdjecia);
    }
  }, [inView, activeSlidePhoto, images, setActiveSlidePhoto]);
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

  const handleRegistration = (data) => {
    console.log(data);
    const postData = {
      tags: data.tags,
      photoId: photoId
    };
    const apiUrl = "http://localhost:8080/api/";  //W[isz tu maciek Api do dodawania tagó]
    const authToken = sessionStorage.getItem("authToken");
    debugger;
    axios
      .post(apiUrl, postData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setMessage(response.data); //Napisz zwrot jakiegoś sukcesu
      })
      .catch((error) => {
        setMessage(error.response && error.response.data ? error.response.data : error.message);
        console.error(error);
      });
};

const registerOptions = {
  tags: { required: "Jest problem z tagami" },
};

const handleError = (errors) => console.log(errors);

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
            {Object.keys(exifData).map((key) => (
              <>
                {typeof exifData[key] === "string" ? (
                  <tr>
                    <th className="TableCategory">{key}: </th>
                    <th className="TableData">{exifData[key].toString()}</th>
                  </tr>
                ) : null}
              </>
            ))}
          </table>
        )}
      </div>
      {
        message ? message : <></>
      }
      <form
        className="Tile"
        onSubmit={handleSubmit(handleRegistration, handleError)}
      >
        <div className="InputField">
          <input
            id="tags"
            type={"text"}
            placeholder="Wpisz tagi po przecinku"
            autoFocus
            {...register("tags", registerOptions.tags)}
          />
        </div>
      </form>
    </div>
  );
}

export default Slide;
