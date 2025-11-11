import React, { useState, useEffect, useContext } from 'react';
import Player from '../components/Player';
import SongList from '../components/SongList';
import { getSongs, getProfile } from '../api';
import { AuthContext } from '../AuthContext';

function Home({ searchQuery }) {
  const { user } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState(user?.favourites || []);

  useEffect(() => {
    getSongs()
      .then(response => {
        setSongs(response.data);
      })
      .catch(err => {
        setError('Failed to load songs. Please make sure the backend is running.');
        console.error(err);
      });
  }, []);

  const handleToggleFavorite = async (songId) => {
    try {
      // Note: Your backend uses '/api/favourites/toggle', but your api.js doesn't have this function yet.
      // This is a placeholder for when you add it.
      // For now, we'll just update the local state.
      const isFavorite = favorites.includes(songId);
      const newFavorites = isFavorite
        ? favorites.filter(id => id !== songId)
        : [...favorites, songId];
      setFavorites(newFavorites);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-page">
      {error && <p className="error-message">{error}</p>}
      <SongList songs={filteredSongs} onPlay={setCurrentSong} onToggleFavorite={handleToggleFavorite} favorites={favorites} />
      <Player currentSong={currentSong} />
    </div>
  );
}

export default Home;