import React, { useState, useEffect } from "react";
import Question from "./Question";
import questions from "../../help.json";
import "./Help.css";

function Help() {
  return (
    <div className="Help">
      {questions.map((question) => (
        <Question
          key={question.id}
          id={question.id}
          question={question.question}
          answer={question.answer}
        />
      ))}
    </div>
  );
}

export default Help;
