import React, { useRef, useEffect } from 'react';

function Player({ currentSong }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.play().catch(error => console.log("Audio play failed:", error));
    }
  }, [currentSong]);

  if (!currentSong) {
    return null; // Don't render the player if no song is selected
  }

  const songUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + currentSong.src;

  return (
    <div className="player">
      <div className="player-info">
        <img src={(process.env.REACT_APP_API_URL || 'http://localhost:5000') + currentSong.image} alt={currentSong.title} />
        <h3>{currentSong.title} - {currentSong.artist}</h3>
      </div>
      <audio ref={audioRef} src={songUrl} controls autoPlay />
    </div>
  );
}

export default Player;