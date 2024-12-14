import React, { useState, useEffect } from "react";
import { database } from "./firebaseConfig";
import { ref, onValue } from "firebase/database";
import './Leaderboard.css';

function LastHourLeaderboard() {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const leaderboardRef = ref(database, "leaderboard");
    const oneHourAgo = Date.now() - 3600000; // Current time minus one hour in milliseconds

    const unsubscribe = onValue(leaderboardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and filter scores from the last hour
        const filteredScores = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter((entry) => entry.timestamp >= oneHourAgo) // Filter last-hour scores
          .sort((a, b) => b.score - a.score) // Sort by score descending
          .slice(0, 15) // Limit to top 15 entries
          .map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));

        setTopScores(filteredScores);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Run only on mount

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>Top Scores in Last Hour</h2>
      </div>
      
      <div className="leaderboard-entries">
        {topScores.map((entry) => {
          let entryClass = 'leaderboard-entry';
          if (entry.rank === 1) entryClass += ' gold-rank';
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
        
        {topScores.length === 0 && (
          <div className="leaderboard-entry no-entries">
            No scores in the last hour
          </div>
        )}
      </div>
    </div>
  );
}

export default LastHourLeaderboard;
