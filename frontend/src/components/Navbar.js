import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import SearchBar from './SearchBar';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h1>🎵 MusicApp</h1>
      {user && <SearchBar onSearch={onSearch} />}
      <div className="user-info">
        {user ? (
          <>
            <Link to="/playlists" className="nav-link">Playlists</Link>
            <span>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/account" className="account-link">Account</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;