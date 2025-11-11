import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import api from '../api';

const Playlists = () => {
  const { user, setUser } = useContext(AuthContext);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [error, setError] = useState('');

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) {
      setError('Playlist name cannot be empty.');
      return;
    }
    setError('');
    try {
      const response = await api.post('/playlists', { name: newPlaylistName });
      // Update user context with the new playlists array from the backend
      setUser({ ...user, playlists: response.data.playlists });
      setNewPlaylistName(''); // Clear the input field
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create playlist.');
    }
  };

  return (
    <div className="playlists-page">
      <h2>My Playlists</h2>

      <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder="New playlist name"
        />
        <button type="submit">Create Playlist</button>
      </form>
      {error && <p className="error-message">{error}</p>}

      <div className="playlist-list">
        {user?.playlists && user.playlists.length > 0 ? (
          user.playlists.map((playlist, index) => (
            <div key={index} className="playlist-item">
              <h3>{playlist.name}</h3>
              <p>{playlist.songs.length} song(s)</p>
            </div>
          ))
        ) : (
          <p>You don't have any playlists yet. Create one above!</p>
        )}
      </div>
    </div>
  );
};

export default Playlists;