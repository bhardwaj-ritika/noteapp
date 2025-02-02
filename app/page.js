"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [subject, setSubject] = useState("");  // For the note subject
  const [textNote, setTextNote] = useState(""); // For the detailed note
  const [urlNote, setUrlNote] = useState("");   // For the URL
  const [imageNote, setImageNote] = useState(null); // For the image
  const [isRecording, setIsRecording] = useState(false); // For recording state
  const [notes, setNotes] = useState([]); // Store the notes
  const [searchQuery, setSearchQuery] = useState(""); // For searching notes
  const router = useRouter();

  useEffect(() => {
    // Retrieve saved notes from MongoDB on page load
    const fetchNotes = async () => {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    };
    fetchNotes();
  }, []);

  const handleNavigateToNotes = () => {
    router.push("/notes"); // Redirects to notes page
  };

  let recognition = null;
  if (typeof window !== "undefined") {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true; // Keep listening
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + " ";
        }
        setTextNote(transcript.trim()); // Update text field in real-time
      };
    }
  }

  const startRecording = () => {
    if (!recognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }
    recognition.start();
  };

  const stopRecording = () => {
    if (!recognition) {
      alert("Speech Recognition API is not supported in this browser.");
      return;
    }
    recognition.stop();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !textNote.trim()) return; // Prevent empty notes

    const newNote = {
      subject,
      text: textNote,
      url: urlNote,
      image: imageNote,
      timestamp: new Date().toLocaleString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);

    // Save the updated notes to localStorage
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    setSubject("");
    setTextNote("");
    setUrlNote("");
    setImageNote(null);
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchQuery.toLowerCase()) // Search in both subject and text
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Note-Taking App</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search notes by subject or text"
        className="border p-2 mb-4 w-full"
      />
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject of your note"
          className="border p-2 mb-2 w-full"
        />
        <textarea
          value={textNote}
          onChange={(e) => setTextNote(e.target.value)}
          placeholder="Enter or speak your note"
          className="border p-2 mb-2 w-full h-32"
        />
        <input
          type="url"
          value={urlNote}
          onChange={(e) => setUrlNote(e.target.value)}
          placeholder="Enter URL"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 mb-2 w-full"
        />
        <div className="flex space-x-2 my-2">
          <button
            type="button"
            onClick={startRecording}
            className="bg-blue-500 text-white p-2"
            disabled={isRecording}
          >
            Start Recording
          </button>
          <button
            type="button"
            onClick={stopRecording}
            className="bg-red-500 text-white p-2"
            disabled={!isRecording}
          >
            Stop Recording
          </button>
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 mt-2">
          Add Note
        </button>
        <button onClick={handleNavigateToNotes} className="bg-blue-500 text-white p-2 mt-2">
          View Notes
        </button>
      </form>

      {/* <div className="mt-4">
        <ul>
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note, index) => (
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
                  {note.image && (
                    <img src={note.image} alt="Uploaded" className="mt-2 w-32 h-32 object-cover rounded" />
                  )}
                </div>
              </li>
            ))
          ) : (
            <p>No notes found.</p>
          )}
        </ul>
      </div> */}
    </div>
  );
}
