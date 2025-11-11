
import React, { useState } from "react";
import Player from "./Player";
import SongList from "./SongList";

function Home() {
  const [songs] = useState([
    { title: 'Perfect', artist: 'Ed Sheeran', url: '/songs/perfect.mp3' },
    { title: 'Blinding Lights', artist: 'The Weeknd', url: '/songs/blinding_lights.mp3' },
    { title: 'Shape of You', artist: 'Ed Sheeran', url: '/songs/shape_of_you.mp3' }
  ]);

  const [currentSong, setCurrentSong] = useState(null);

  return (
    <div className="home-page">
      <SongList songs={songs} onSelect={setCurrentSong} />
      <Player song={currentSong} />
    </div>
  );
}

export default Home;
