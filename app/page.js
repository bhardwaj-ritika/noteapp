"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [subject, setSubject] = useState("");
  const [textNote, setTextNote] = useState("");
  const [urlNote, setUrlNote] = useState("");
  const [imageNote, setImageNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Toggle menu dropdown

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    }
    fetchNotes();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Attempting to log in with:", { email, password }); // Log email and password

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Response status:", response.status); // Log response status

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email); // Store email
      setIsLoggedIn(true);
    } else {
      const errorData = await response.json();
      setError(errorData.message);
      console.log("Error message:", errorData.message); // Log error message
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setEmail("");
  };

  const fetchNotes = async () => {
    const response = await fetch('/api/notes');
    const data = await response.json();
    setNotes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !textNote.trim()) return;

    const newNote = { subject, text: textNote, url: urlNote, image: imageNote };
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });

    if (response.ok) {
      fetchNotes();
      setSubject("");
      setTextNote("");
      setUrlNote("");
      setImageNote(null);
    }
  };

  return (
    <div className="p-4 relative">
      {/* Top-Right User Icon or Login Button */}
      <div className="absolute top-4 right-4">
        {isLoggedIn ? (
          <div className="relative">
            {/* Circle with first letter of email */}
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
            >email
              {email.charAt(0).toUpperCase()}
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-2">
                <p className="px-4 py-2 text-gray-700">{email}</p>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => router.push("#login")} className="bg-blue-500 text-white px-4 py-2 rounded">
            Login
          </button>
        )}
      </div>

      {/* Login Form (Only if Not Logged In) */}
      {!isLoggedIn ? (
        <div id="login">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <form onSubmit={handleLogin} className="mb-4">
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 mb-2 w-full"
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 mb-2 w-full"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
              Login
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Note-Taking App</h1>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes"
            className="border p-2 mb-4 w-full"
          />
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="border p-2 mb-2 w-full"
            />
            <textarea
              value={textNote}
              onChange={(e) => setTextNote(e.target.value)}
              placeholder="Write your note"
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
              onChange={(e) => setImageNote(e.target.files[0])}
              className="border p-2 mb-2 w-full"
            />
            <button type="submit" className="bg-green-500 text-white p-2 mt-2">
              Add Note
            </button>
          </form>
        </>
      )}
    </div>
  );
}
