import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useInView } from "react-intersection-observer";

import axios from "axios";

import "./Profile.css";

import Eye from "../../../assets/eye.svg";
import EyeClose from "../../../assets/eye-alt.svg";

function Profile() {
  const [message, setMessage] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);
  const [repasswordShow, setRepasswordShow] = useState(false);
  const [userInfo, getUserInfo] = useState(null)
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const authToken = sessionStorage.getItem("authToken");
  console.log("authToken:", authToken);
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
        minLength: {
          value: 5,
          message: "Hasło musi posiadać przynajmniej 5 znaków",
        },
    },
    repassword: {
      //   required: "Hasło nie zostało powtórnie wprowadzone",
        validate: (match) => {
          const password = getValues("password");
          return match === password || "Hasła muszą być takie same";
        },
    },
  };


  useEffect(() => {
    if (inView && loading) {
      let apiURL;
      apiURL = "http://localhost:8080/api/profile";
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
          getUserInfo(response.data);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [inView, authToken, loading]);

  console.log("Profile component rendered with userInfo:", userInfo);

  const onSubmit = async (data) => {
    const postData = {username: data.username, email: data.email, password: data.password};
    console.log("Button clicked with data:", postData);
    debugger;
    try {
        const response = await axios.post("http://localhost:8080/api/uploadUser", postData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "*/*",
                "Content-Type": "application/json",
            },
        });
        setMessage(response.data);
    } catch (error) {
        console.error(error);
        setMessage("Wystąpił błąd podczas zapisywania zmian");
    }
};


  return (
    <div className="Container" ref={ref}>
    {loading ? <p>Loading</p> :(
    <form className="FormProfile" onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="InfoProfile">
        <div className="Text">{message ? message : "Edycja profilu"}</div>
        <div className="Info" id="infp">
          <label htmlFor="info">Twoje aktualne informacje: </label>
          <p>Nazwa użytkownika: {userInfo?.username || "Brak"}</p>
          <p>Adres e-mail: {userInfo?.email || "Brak"}</p>
        </div>
      </div>
      <div className="Profile">
        <div className="InputGroup">
          <div className="InputField">
            <label htmlFor="login">Zmień nazwę użytkownika: </label>
            <input
              id="login"
              type="text"
              placeholder={"Wpisz nową nazwę użytkownika"}
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
              placeholder={"Wpisz nowy adres e-mail"}
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
    )}
  </div>
    
  );
}

export default Profile;
