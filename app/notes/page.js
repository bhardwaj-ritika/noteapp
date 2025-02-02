"use client";

import { useState, useEffect } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Retrieve saved notes from localStorage
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Saved Notes</h1>
      <a href="/" className="text-blue-500 underline">Go Back</a>
      <div className="mt-4">
        <ul>
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <li key={index} className="mb-4">
                <div className="p-4 border border-gray-300 rounded-lg shadow-md">
                  <h3 className="font-bold text-xl">{note.subject}</h3>
                  <p className="text-gray-500">{note.timestamp}</p>
                  <p className="mt-2">{note.text}</p>
                  {note.url && (
                    <a href={note.url} className="text-blue-500 block mt-2">
                      {note.url}
                    </a>
                  )}
                 
                </div>
              </li>
            ))
          ) : (
            <p>No notes found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
