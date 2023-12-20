import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../Form.css";

import Eye from "../../../assets/eye.svg";
import EyeClose from "../../../assets/eye-alt.svg";

function AddCategory() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const handleCategory = (data) => {
    console.log(data);
    const postData = {
      category: data.category,
      parentCategory: data.parentCategory,
    };
    const apiUrl = "http://localhost:8080/api/add_category";
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
        setMessage(response.data);
        //navigate('/albums');
        //window.location.reload();
      })
      .catch((error) => {
        // Obsłuż błąd
        /*setMessage(
          `${
            error.response ? error.response.data.message : "Pierdolło"
          }`
        );*/
        console.log(error);
      });
  };
  const handleError = (errors) => console.log(errors);

  const registerOptions = {
    category: {
      required: "Adres e-mail nie został wprowadzony",
    },
    parentCategory: {
      required: "Hasło nie zostało wprowadzone",
    }};

  /*useEffect(() => {
    // Sprawdź stan sesji lub wykonaj inne operacje po załadowaniu komponentu
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      navigate("/albums");
      console.log('Użytkownik jest zalogowany');
    }
  }, []);*/

  // const handleClick = () => {
  //   if (password.showPassword === true)
  //     setPassword({ ...password, showPassword: false });
  //   else setPassword({ ...password, showPassword: true });
  // };


  return (
    <div className="Container" >
      <form className="Form" onSubmit={handleSubmit(handleCategory, handleError)}>
        <div className="Text">
          Dodaj kategorie <p>{message}</p>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="category">Category: </label>
            <input
              type="text"
              id="category"
              {...register("category", registerOptions.category)}
            ></input>
            {errors?.username && <p>{errors.username.message}</p>}
          </div>
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="parentCategory">Kategoria rodziczna: </label>
            <input
              type="text"
              id="parentCategory"
              {...register("parentCategory", registerOptions.parentCategory)}
            ></input>
          </div>
          {errors?.password && <p>{errors.password.message}</p>}
        </div>
        <input type="submit" value={"Zaloguj się"}></input>
      </form>
    </div>
  );
}

export default AddCategory;
