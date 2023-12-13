import React, { useState } from 'react';

function PhotoUploadForm() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const authToken = sessionStorage.getItem("authToken");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert('Wybierz przynajmniej jeden plik przed wysłaniem formularza.');
      return;
    }

    try {
      // Przygotowanie danych do wysłania na serwer
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`photo-${index + 1}`, file);
      });

      // Wysłanie formData na backend
      const response = fetch('http://localhost:8080/api/photo_upload', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      //const response = fetch ('http://localhost:8080/api/photo_upload', authToken);
      debugger;
      // Sprawdzenie, czy żądanie zostało wykonane poprawnie
      if (response.ok) {
        // Pobranie odpowiedzi z serwera w formie JSON
        const jsonResponse = await response.json();

        // Przetworzenie odpowiedzi (jeśli serwer zwraca jakieś dodatkowe informacje)
        console.log('Odpowiedź serwera:', jsonResponse);
      } else {
        console.error('Wystąpił błąd podczas wysyłania danych na serwer.');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas dodawania zdjęć:', error);
    }
  };

  
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="fileInput">Wybierz zdjęcia: </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          multiple
        />
      </div>
      <div>
        <label htmlFor="fileInput">Wybierz kategorię: </label>
        <select>
        <option value="">--select--</option>
        <option value="1">Moje fotki</option>
        <option value="2">Zwierzątka</option>
        </select>  
      </div>
      <div>
        <button type="submit">Dodaj Zdjęcia</button>
      </div>
    </form>
  );
};

export default PhotoUploadForm;