import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  // initial load of questions
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => setQuestions(data));
  }, []);

  function handleAddQuestion(newQuestion) {
    setQuestions((qs) => [...qs, newQuestion]);
  }

  function handleDeleteQuestion(id) {
    // update state after server delete
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" }).then(() => {
      setQuestions((qs) => qs.filter((q) => q.id !== id));
    });
  }

  function handleUpdateQuestion(id, correctIndex) {
    // optimistic update
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, correctIndex } : q)));
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex }),
    })
      .then((r) => r.json())
      .then((updated) => {
        setQuestions((qs) =>
          qs.map((q) => (q.id === id ? { ...q, correctIndex: updated.correctIndex } : q))
        );
      });
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;
