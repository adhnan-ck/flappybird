import React, { useState, useEffect } from "react";
import { database } from "./firebaseConfig";
import { ref, onValue } from "firebase/database";
import './Leaderboard.css';
import LastHourLeaderboard from "./LastHourLeaderboard";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const leaderboardRef = ref(database, "leaderboard");

    // Listen for data updates
    const unsubscribe = onValue(leaderboardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the data from an object to an array and sort by score descending
        const leaderboardArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 15)
          .map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));

        // Sort scores in descending order
        setLeaderboard(leaderboardArray);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <>
    <LastHourLeaderboard/>
    <br></br>
    <br></br>
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>THE GREATEST OF ALL TIME</h2>
      </div>
      
      <div className="leaderboard-entries">
        {leaderboard.map((entry) => {
          let entryClass = 'leaderboard-entry';
          if (entry.rank === 1) {
            entryClass += ' gold-rank first-place-shine';
          }
          if (entry.rank === 2) entryClass += ' silver-rank';
          if (entry.rank === 3) entryClass += ' bronze-rank';
          
          return (
            <div key={entry.id} className={entryClass}>
              <div className="entry-rank">{entry.rank}</div>
              <div className="entry-name">{entry.name}</div>
              <div className="entry-score">{entry.score}</div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}

export default Leaderboard;