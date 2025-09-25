import React, { createContext, useState } from "react";

export const FlashcardsContext = createContext();

export const FlashcardsProvider = ({ children }) => {
  const [flashcards, setFlashcards] = useState([]);

  // Add a flashcard
  const addFlashcard = (card) => {
    setFlashcards((prev) => [...prev, card]);
  };

  // Delete a flashcard by id
  const deleteFlashcard = (id) => {
    setFlashcards((prev) => prev.filter((c) => c.id !== id));
  };

  // Clear all flashcards
  const clearFlashcards = () => {
    setFlashcards([]);
  };

  return (
    <FlashcardsContext.Provider
      value={{ flashcards, addFlashcard, deleteFlashcard, clearFlashcards }}
    >
      {children}
    </FlashcardsContext.Provider>
  );
};
