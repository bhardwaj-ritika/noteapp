"use client";

import { useState, useEffect } from "react";
import NoteModal from "../models/Note";
import { connectToDatabase } from '../lib/mongodb';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const db = await connectToDatabase();
      const notesCollection = db.collection('notes');
      const notesData = await notesCollection.find({}).toArray();
      setNotes(notesData);
    };

    fetchNotes();
  }, []);

  const deleteNote = async (index) => {
    const noteToDelete = notes[index];
    const db = await connectToDatabase();
    const notesCollection = db.collection('notes');
    
    // Delete the note from MongoDB
    await notesCollection.deleteOne({ _id: noteToDelete._id });

    // Update the local state
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const openModal = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleEdit = async (editedNote) => {
    const updatedNotes = notes.map((note) =>
      note.subject === editedNote.subject ? editedNote : note
    );
    setNotes(updatedNotes);
    // Implement update logic in MongoDB
  };

  const handleFavorite = (note) => {
    // Implement favorite functionality here
  };

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
                  <button
                    onClick={() => openModal(note)} 
                    className="mt-2 text-blue-500"
                  >
                    View/Edit
                  </button>
                  <button 
                    onClick={() => deleteNote(index)} 
                    className="mt-2 text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No notes found.</p>
          )}
        </ul>
      </div>
      <NoteModal 
        note={selectedNote} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onEdit={handleEdit} 
        onFavorite={handleFavorite} 
      />
    </div>
  );
}