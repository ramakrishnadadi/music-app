
import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Account from './pages/Account';
import Playlists from './pages/Playlists';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <Router>
      <Navbar onSearch={handleSearch} />
      <main className="container">
        <Routes>
          <Route path="/" element={user ? <Home searchQuery={searchQuery} /> : <Navigate to="/account" />} />
          <Route path="/account" element={!user ? <Account /> : <Navigate to="/" />} />
          <Route path="/playlists" element={user ? <Playlists /> : <Navigate to="/account" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
