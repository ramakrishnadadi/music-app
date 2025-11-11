import React from "react";

const SongList = ({ songs, onPlay, onToggleFavorite, favorites }) => {
  const defaultImage = '/images/default-cover.png'; // A default image in your backend's public/images folder

  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div key={song.id || index} className="song-card">
          <img 
            src={(process.env.REACT_APP_API_URL || 'http://localhost:5000') + (song.image || defaultImage)} 
            alt={song.title} 
          />
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
          <div className="song-card-buttons">
            <button onClick={() => onPlay(song)}>Play</button>
            <button onClick={() => onToggleFavorite(song.id)}>
              {favorites.includes(song.id) ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SongList;