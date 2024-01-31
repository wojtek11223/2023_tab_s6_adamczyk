import React, { useState } from "react";
import "./Help.css";

function Question({ id, question, answer }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="QuestionBox">
      <div className="Question" onClick={() => setShowAnswer(!showAnswer)}>
        {id + 1 + ". "}
        {question}
      </div>
      {showAnswer ? <div className="Answer">{answer}</div> : null}
    </div>
  );
}

export default Question;
