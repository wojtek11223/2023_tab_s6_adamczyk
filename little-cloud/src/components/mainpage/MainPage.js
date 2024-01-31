import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

function MainPage() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiURL = "http://localhost:8080/api/mainpage";
        const authToken = sessionStorage.getItem("authToken");

        const response = await axios.get(apiURL, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        });

        setData(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania danych z API:", error);
      }
    };

    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      navigate("/mainpage");
    } else {
      fetchData();
    }
  }, [navigate]);

  return (
    <div>
      <div className="container">
        <h1>Littlecloud</h1>
        <p5>Twoja mała chmurka.</p5>
        {/* Dodatkowe treści strony głównej */}
      </div>

      <section id="aboutus">
        <div className="container aboutus-boxes py-5">
          <div className="row text-center">
            <div className="aboutus-box">
              <h3>Zapomnij o problemach z pamięcią!</h3>
              <p>
                {" "}
                Właśnie wróciłeś z wakacji, a na twoim telefonie brakuje już
                pamięci na zdjęcia?
              </p>
              <p>Mamy dla ciebie idealne rozwiązanie!</p>
              <p>
                {" "}
                Stwórz swoją własną, nieograniczoną galerię zdjęć na naszej
                platformie. Wystarczy założyć konto, żeby w pełni wykorzystywać
                jej potencjał.
              </p>
            </div>

            <div className="aboutus-box">
              <h3>Twoje zdjęcia, Twoje zasady.</h3>
              <p>
                Spraw, aby każde zdjęcie opowiadało swoją historię. Utwórz
                własne albumy, nadawaj kategorie, dodawaj tagi, a także
                eksploruj metadane, które sprawią, że każde zdjęcie stanie się
                jeszcze bardziej wartościowe.{" "}
              </p>
              <p>
                Szukasz konkretnego zdjęcia? Filtrując po tagach i kategoriach
                odnajdziesz je w mgnieniu oka!
              </p>
            </div>

            <div className="aboutus-box">
              <h3>Za kulisami obrazu.</h3>
              <p>Twoje zdjęcia skrywają wiele ciekawych informacji.</p>
              <p>
                Nie tylko wymiary i format - przypomnij sobie czym robiłeś
                zdjęcie i jakie ustawienia dostosowywałeś.
              </p>
              <p>
                Wyświetl je na naszej stronie i zobacz jak wiele informacji
                można wyciągnąć z jego metadanych.
              </p>
            </div>

            <div className="aboutus-box">
              <h3>Autorzy:</h3>
              <p>
                Projekt został wykonany na Bazy Danych przez grupę studentów
                Teleinformatyki.
              </p>
              <p>
                Jedną z wielu rzeczy, która nas łączy jest pasja do
                programowania, dlatego spędziliśmy wiele godzin na ożywionych
                dyskusjach, żeby zaprezentować jak najlepszy efekt końcowy.
              </p>
              <p>Mamy nadzieję, że rezultat wam się spodoba,</p>
              <p>Michał, Wojtek, Ania, Maciek i Bartek</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;
