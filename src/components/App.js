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
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  function handleAddQuestion(newQuestion) {
    setQuestions((qs) => [...qs, newQuestion]);
  }

  function handleDeleteQuestion(id) {
    fetch(`http://localhost:4000/questions/${id}`, { method: "DELETE" })
      .then((r) => {
        if (r.ok) {
          setQuestions((qs) => qs.filter((q) => q.id !== id));
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => console.error("Error deleting question:", error));
  }

  function handleUpdateQuestion(id, correctIndex) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, correctIndex } : q)));
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correctIndex }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((updated) => {
        setQuestions((qs) =>
          qs.map((q) => (q.id === id ? { ...q, correctIndex: updated.correctIndex } : q))
        );
      })
      .catch((error) => console.error("Error updating question:", error));
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
