import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import "../Form.css";

import Eye from "../../../assets/eye.svg";
import EyeClose from "../../../assets/eye-alt.svg";

function Register() {
  const [message, setMessage] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [repasswordShow, setRepasswordShow] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const handleRegistration = (data) => {
    console.log(data);
    const postData = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    const apiUrl = "http://localhost:8080/api/register";
    // Wywołaj API za pomocą Axios
    axios
      .post(apiUrl, postData)
      .then((response) => {
        // Sprawdź, czy response.data nie jest undefined
        if (response.data) {
          setMessage("Zarejestrowano pomyślnie :)");
        } else {
          setMessage("Login failed. Invalid response from the server.");
        }
      })
      .catch((error) => {
        setMessage(
          `Nieudana rejestracja. ${
            error.response.data ? error.response.data : error.message
          }`
        );
      });
  };
  const handleError = (errors) => console.log(errors);

  const registerOptions = {
    username: { required: "Nazwa użytkownika nie została wprowadzona " },
    email: {
      required: "Adres e-mail nie został wprowadzony",
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: "Zły format adresu e-mail",
      },
    },
    password: {
      required: "Hasło nie zostało wprowadzone",
      minLength: {
        value: 5,
        message: "Hasło musi posiadać przynajmniej 5 znaków",
      },
    },
    repassword: {
      required: "Hasło nie zostało powtórnie wprowadzone",
      validate: (match) => {
        const password = getValues("password");
        return match === password || "Hasła muszą być takie same";
      },
    },
    regulations: { required: "Regulamin nie został zaakceptowany" },
  };

  return (
    <div className="Container">
      <form
        className="Form"
        onSubmit={handleSubmit(handleRegistration, handleError)}
      >
        <div className="Text">{message ? message : "Zarejestruj się :)"}</div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="login">Nazwa użytkownika: </label>
            <input
              id="login"
              type="text"
              // placeholder="Nazwa użytkownika"
              {...register("username", registerOptions.username)}
            ></input>
          </div>
          {errors?.username && <p>{errors.username.message}</p>}
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="email">Adres e-mail: </label>
            <input
              id="email"
              type="text"
              // placeholder="Adres e-mail"
              {...register("email", registerOptions.email)}
            ></input>
          </div>

          {errors?.email && <p>{errors.email.message}</p>}
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="password">Hasło: </label>
            <input
              id="password"
              type={passwordShow ? "text" : "password"}
              // placeholder="Hasło"
              {...register("password", registerOptions.password)}
            ></input>
            <a onClick={() => setPasswordShow((passwordShow) => !passwordShow)}>
              {<img src={passwordShow ? EyeClose : Eye} alt="" />}
            </a>
          </div>
          {errors?.password && <p>{errors.password.message}</p>}
        </div>
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="repassword">Powtórz hasło: </label>
            <input
              id="repassword"
              type={repasswordShow ? "text" : "password"}
              // placeholder="Powtórz hasło"
              {...register("repassword", registerOptions.repassword)}
            ></input>
            <a
              onClick={() =>
                setRepasswordShow((repasswordShow) => !repasswordShow)
              }
            >
              {<img src={repasswordShow ? EyeClose : Eye} alt="" />}
            </a>
          </div>
          {errors?.repassword && <p>{errors.repassword.message}</p>}
        </div>
        <div className="InputGroup">
          <div className="Regulations">
            <input
              type="checkbox"
              {...register("regulations", registerOptions.regulations)}
            ></input>
            Zaakceptuj regulamin naszej strony
          </div>
          {errors?.regulations && <p>{errors.regulations.message}</p>}
        </div>
        <input id="regulations" type="submit" value={"Zarejestruj się"}></input>
      </form>
    </div>
  );
}

export default Register;
