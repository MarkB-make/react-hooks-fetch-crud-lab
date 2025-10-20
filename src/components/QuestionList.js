import React from "react";
import QuestionItem from "./QuestionItem";

function QuestionList({ questions, onDeleteQuestion, onUpdateQuestion }) {
  const items = questions.map((q) => (
    <QuestionItem
      key={q.id}
      question={q}
      onDeleteQuestion={onDeleteQuestion}
      onUpdateQuestion={onUpdateQuestion}
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
