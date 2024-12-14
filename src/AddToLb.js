import React, { useState } from "react";
import { database } from "./firebaseConfig"; // Import Firebase database
import { ref, push } from "firebase/database";
import './AddToLb.css';
import { useNavigate } from 'react-router-dom';

function AddToLb({ score,setScore }) {
  const [name, setName] = useState(""); // State for username
  const navigate = useNavigate();
  const handleSave = async () => {
    if (!name) {
      alert("Please enter your name!");
      return;
    }
    try {
      // Push data to Realtime Database
      await push(ref(database, "leaderboard"), {
        name: name,
        score: score,
        timestamp: Date.now(), // Optional: Add a timestamp
      });
      alert("Score saved successfully!");
      setName(""); // Clear input field
      setScore(0); //Reset the score to 0
      navigate('/leaderboard');
    } catch (error) {
      console.error("Error saving to database: ", error);
      alert("Failed to save the score. Please try again.");
    }
  };

  return (
    <div className="add-to-leaderboard">
      <h1>Add to Leaderboard</h1>
      <p>Your Score: {score}</p>
      <label>
        <p>Your Name:</p>
      </label>
      <input
        type="text"
        name="username"
        value={name}
        onChange={(e) => setName(e.target.value)} // Update state
      ></input>
      <br />
      <br />
      <button onClick={handleSave}>Done</button> {/* Save to Firebase */}
    </div>
  );
}

export default AddToLb;
