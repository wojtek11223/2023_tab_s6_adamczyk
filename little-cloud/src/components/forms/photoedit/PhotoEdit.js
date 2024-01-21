import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./PhotoEdit.css";
import "../Form.css";

function PhotoEdit({
  showEditPhoto,
  setShowEditPhoto,
  activePhoto,
  parentCategory,
}) {
  let editForm = useRef();
  const navigate = useNavigate();

  const [checkedTags, setCheckedTags] = useState([]);

  const [message, setMessage] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm();

  const registerOptions = {
    name: {
      // required: "Nazwa użytkownika nie została wprowadzona ",
    },
    date: {
      // required: "Data nie została wprowadzona",
    },
    albumname: {
      //   required: "Nazwa albumu nie została wprowadzona",
    },
    tags: {
      //   required: "Tagi nie zostały dodane",
    },
  };

  const onSubmit = async (data) => {
    debugger;
    console.log(data);
    const postData = {
      name: `${data.name}.${
        activePhoto.nazwa.split(".")[1] !== undefined
          ? activePhoto.nazwa.split(".")[1]
          : activePhoto.format.split("/")[1]
      }`,
      date: data.date,
      albumsName: data.albumname,
      tags: data.tags,
      photoid: activePhoto.idZdjecia,
      categoryid: parentCategory !== undefined ? parentCategory : null,
      tagsToDelete: checkedTags,
    };

    const apiUrl = "http://localhost:8080/api/edit_photo";
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
        parentCategory !== undefined
          ? navigate(`/albums/${parentCategory}`)
          : navigate("/albums");
        window.location.reload();
      })
      .catch((error) => {
        setMessage(
          error.response && error.response.data
            ? error.response.data
            : error.message
        );
        setError();
        console.error(error);
      });
  };

  const handleError = (errors) => console.log(errors);

  useEffect(() => {
    function handler(e) {
      if (editForm && !editForm.current.contains(e.target)) {
        setShowEditPhoto(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [editForm]);

  useEffect(() => {
    if (showEditPhoto) {
      const handleEsc = (e) => {
        if (e.key === "Escape") {
          setShowEditPhoto(false);
        }
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [showEditPhoto, setShowEditPhoto]);
  const date = new Date(activePhoto.dataWykonania);

  const [defaultDate, setDefaultDate] = useState(
    date.toISOString().split("T")[0]
  );

  const handleCheckboxChange = (value) => {
    if (checkedTags.includes(value)) {
      setCheckedTags(checkedTags.filter((item) => item !== value));
    } else {
      setCheckedTags([...checkedTags, value]);
    }
  };

  return (
    <div className="BlurAll">
      <form
        className="Form"
        ref={editForm}
        onSubmit={handleSubmit(onSubmit, handleError)}
      >
        <div className="InputGroup">
          <div className="InputField">
            <label>Nazwa zdjęcia: </label>
            <input
              type="text"
              defaultValue={activePhoto.nazwa.split(".")[0]}
              {...register("name", registerOptions.name)}
            />
            {errors?.name && <p>{errors.name.message}</p>}
          </div>
        </div>

        <div className="InputGroup">
          <div className="InputField">
            <label>Data Wykonania: </label>
            <input
              type="date"
              {...register("date", registerOptions.date)}
              defaultValue={defaultDate}
            />
          </div>
          {errors?.date && <p>{errors.date.message}</p>}
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label>Nazwy albumów: </label>
            <input
              type="text"
              {...register("albumname", registerOptions.albumname)}
            />
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label>Tagi: </label>
            <input type="text" {...register("tags", registerOptions.tags)} />
          </div>
        </div>
        <div className="InputGroup">
          <div className="Blocks">
            <label>Zaznacz tagi, które chcesz usunąć: </label>
            <ul>
              {activePhoto &&
                activePhoto.tags.length !== 0 &&
                activePhoto.tags.map((item) => (
                  <li key={item} onClick={() => handleCheckboxChange(item)}>
                    <input
                      type="checkbox"
                      id={item}
                      checked={checkedTags.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                    {item.toLowerCase()}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="InputGroup">
          <div className="InputField">
            <input type="submit" value="Edytuj zdjęcie" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default PhotoEdit;
