import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => setQuestions(data));
  }, []);

  function handleDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    }).then(() => {
      setQuestions((qs) => qs.filter((q) => q.id !== id));
    });
  }

  function handleUpdateQuestion(id, correctIndex) {
    // optimistic update
    setQuestions((qs) =>
      qs.map((q) => (q.id === id ? { ...q, correctIndex } : q))
    );

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex }),
    })
      .then((r) => r.json())
      .then((updated) => {
        // ensure state matches server response
        setQuestions((qs) =>
          qs.map((q) => (q.id === id ? { ...q, correctIndex: updated.correctIndex } : q))
        );
      });
  }

  const items = questions.map((q) => (
    <QuestionItem
      key={q.id}
      question={q}
      onDeleteQuestion={handleDeleteQuestion}
      onUpdateQuestion={handleUpdateQuestion}
    />
  ));

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>{items}</ul>
    </section>
  );
}

export default QuestionList;
