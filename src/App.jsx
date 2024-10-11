import React, { useState, useEffect } from "react";
import "./App.css"; // Import the new styles

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timerActive, setTimerActive] = useState(false);

  // Fetch quiz data from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("https://quizapi.io/api/v1/questions", {
          headers: {
            "X-Api-Key": import.meta.env.VITE_QUIZ_API_KEY,
          },
        });
        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="error">
        No questions available. Please try again later.
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setTimerActive(true);

    setTimeout(() => {
      setCorrectAnswer(currentQuestion.correct_answer);
      if (answer === currentQuestion.correct_answer) {
        setScore(score + 1);
      }
      setIsSubmitted(true);
      setTimerActive(false);
    }, 3000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    setIsSubmitted(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div className="quiz-app">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <h1 className="title">Quiz App by Samir</h1>
      <div className="question-container">
        <h2 className="question-title">
          {currentQuestionIndex + 1}. {currentQuestion.question}
        </h2>
        <div className="answers-container">
          {Object.keys(currentQuestion.answers).map((key, index) => {
            const answer = currentQuestion.answers[key];
            if (!answer) return null;

            let answerClass = "";
            if (isSubmitted) {
              if (key === currentQuestion.correct_answer) {
                answerClass = "correct";
              } else if (key === selectedAnswer) {
                answerClass = "incorrect";
              }
            }

            return (
              <button
                key={index}
                className={`answer-button ${answerClass} ${
                  selectedAnswer === key ? "selected" : ""
                }`}
                onClick={() => handleAnswerSelect(key)}
                disabled={isSubmitted || timerActive}
              >
                {answer}
              </button>
            );
          })}
        </div>
        {isSubmitted && (
          <div className="feedback-container">
            <button onClick={handleNextQuestion} className="next-button">
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </button>
          </div>
        )}
        <div className="score-display">Score: {score}</div>
      </div>
      {timerActive && <div className="timer-bar"></div>}
    </div>
  );
}

export default App;
