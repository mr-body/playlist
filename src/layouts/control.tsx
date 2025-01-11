import React, { useState } from 'react';

const Bottom = ({ playerRef }) => {
  const [volume, setVolume] = useState(100);

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * playerRef.current.getDuration();
    playerRef.current.seekTo(newTime, true);
  };

  return (
    <div>
      <div>
        <img id="videoThumbnail" src="" alt="Capa do vídeo" style={{ display: 'none', width: '640px', height: '360px' }} />
      </div>
      <div>
        <label id="time_in">00:00</label>
        <input type="range" id="progress-bar" defaultValue="0" step="1" min="0" max="100" onChange={handleProgressChange} />
        <label id="time_out">00:00</label>
      </div>
      <div>
        <label htmlFor="volume">Volume:</label>
        <input type="range" id="volume" value={volume} step="1" min="0" max="100" onChange={handleVolumeChange} />
      </div>
      <div>
        <button onClick={() => playerRef.current.playVideo()}>Play</button>
        <button onClick={() => playerRef.current.pauseVideo()}>Pause</button>
        <button onClick={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, true)}>Recuar 10s</button>
        <button onClick={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10, true)}>Avançar 10s</button>
        <button onClick={() => playerRef.current.seekTo(0, true)}>Reiniciar</button>
      </div>
    </div>
  );
};

export default Bottom;