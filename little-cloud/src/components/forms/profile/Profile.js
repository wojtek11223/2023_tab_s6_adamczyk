import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import "./Profile.css";

import Eye from "../../../assets/eye.svg";
import EyeClose from "../../../assets/eye-alt.svg";

function Profile() {
  const [message, setMessage] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [repasswordShow, setRepasswordShow] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const handleError = (errors) => console.log(errors);

  const registerOptions = {
    username: {
      //  required: "Nazwa użytkownika nie została wprowadzona "
    },
    email: {
      //   required: "Adres e-mail nie został wprowadzony",
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: "Zły format adresu e-mail",
      },
    },
    password: {
      //   required: "Hasło nie zostało wprowadzone",
      //   minLength: {
      //     value: 5,
      //     message: "Hasło musi posiadać przynajmniej 5 znaków",
      //   },
    },
    repassword: {
      //   required: "Hasło nie zostało powtórnie wprowadzone",
      //   validate: (match) => {
      //     const password = getValues("password");
      //     return match === password || "Hasła muszą być takie same";
      //   },
    },
  };

  return (
    <div className="Container">
      <form
        className="FormProfile"
        // onSubmit={handleSubmit(handleRegistration, handleError)}
      >
        <div className="InfoProfile">
          <div className="Text">{message ? message : "Edycja profilu"}</div>
          <div className="Info" id="infp">
            <label htmlFor="info">Twoje aktualne informacje: </label>
            <p>Nazwa użytkownika: Adam</p>
            <p>Adres e-mail: mail@mail.pl</p>
          </div>
        </div>
        <div className="Profile">
          <div className="InputGroup">
            <div className="InputField">
              <label htmlFor="login">Zmień nazwę użytkownika: </label>
              <input
                id="login"
                type="text"
                placeholder={"Jakaś faken nazwa twoja"}
                {...register("username", registerOptions.username)}
              ></input>
            </div>
            {errors?.username && <p>{errors.username.message}</p>}
          </div>
          <div className="InputGroup">
            <div className="InputField">
              <label htmlFor="email">Zmień adres e-mail: </label>
              <input
                id="email"
                type="text"
                placeholder={"mail@mail.pl"}
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
                {...register("password", registerOptions.password)}
              ></input>
              <a
                onClick={() => setPasswordShow((passwordShow) => !passwordShow)}
              >
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
          <input
            id="regulations"
            type="submit"
            value={"Zatwierdź zmiany"}
          ></input>
        </div>
      </form>
    </div>
  );
}

export default Profile;
