import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import './lib/boxicons/css/boxicons.min.css';

const Top = ({ setVideoURL }) => {
  const [url, setUrl] = useState("");
  return (
    <div className="header">
      <div>
        <i className="bx bx-link"></i>
        <input
          type="text"
          id="videoURL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole o link do vídeo do YouTube"
        />
        <button onClick={() => { setVideoURL(url); setUrl(""); }}>
          <i className="bx bx-play"></i>
          <span>Tocar Música</span>
        </button>
      </div>
    </div>
  );
};

const Left = ({ videoData }) => {
  return (
    videoData.length > 0 && (
      <div className="capa" style={{ backgroundImage: `url(${videoData[0]})` }}>
        <div className="info">
          <h2>{videoData[1] || 'title'}</h2>
          <span>{videoData[2] || 'Author'}</span>
          <span>{videoData[4] || 'link'}</span>
        </div>
      </div>
    )
  );
};

const Bottom = ({ playerRef, setShowVideo, showVideo, videoData, setVideoURL, setFavorite, favorite, isPaused, setPaused, views, setView, loading }) => {
  const [volume, setVolume] = useState(100);
  const [showVolume, setShowVolume] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

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

    if (e.target.value > 50) {
      const videoId = playerRef.current.getVideoData().video_id;
      if (!views.some(view => view[5] === videoId)) {
        setView([...views, videoData]);
      }
    }
  };
  return (
    <div className="control">
      {
        videoData != null ? (
          <>
            <div className="left">
        <img
          id="videoThumbnail"
          src=""
          alt="Capa do vídeo"
          style={{ width: '40px', height: '40px', borderRadius: '4px', display: 'none', objectFit: 'cover' }}
        />
        <button onClick={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10, true)}>
          <i className="bx bx-skip-previous"></i>
        </button>
        {isPaused ? (
          <button onClick={() => { playerRef.current.playVideo(); setPaused(false); }}>
            <i className="bx bx-play"></i>
          </button>
        ) : (
          <button onClick={() => { playerRef.current.pauseVideo(); setPaused(true); }}>
            <i className="bx bx-pause"></i>
          </button>
        )}
        <button onClick={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10, true)}>
          <i className="bx bx-skip-next"></i>
        </button>
        <button onClick={() => playerRef.current.seekTo(0, true)}>
          <i className="bx bx-refresh"></i>
        </button>
      </div>
      <div className="center">
        <label id="time_in">00:00</label>
        <input
          type="range"
          id="progress-bar"
          defaultValue="0"
          step="1"
          min="0"
          max="100"
          onChange={handleProgressChange}
        />
        <label id="time_out">00:00</label>
      </div>
      <div className="right" style={{ display: (videoData && videoData[1] && videoData[1].length > 0) ? "" : "none" }}>
        <div className="volume">
          <button onClick={() => setShowVolume(!showVolume)}>
            {volume == 0 ? <i className='bx bxs-volume-mute'></i> : volume < 50 ? <i className="bx bxs-volume-low"></i> : <i className="bx bxs-volume-full"></i>}
          </button>
          <div className="p_volume">
            <input
              type="range"
              id="volume"
              value={volume}
              step="1"
              min="0"
              max="100"
              onChange={handleVolumeChange}
            />
          </div>
        </div>
        <div>
          <button onClick={() => setShowRecent(!showRecent)}>
            <i style={{ color: showRecent ? "var(--items-color)" : undefined }} className="bx bxs-playlist"></i>
          </button>
          {
            showRecent ? (
              <div className='p_recent'>
                {views.length > 0 ? views.map((item, index) => (
                  <div key={index} className={`recent-item`} onDoubleClick={() => { setVideoURL(item.url, item.id) }}>
                    <img src={item[0]} width={45} height={45} alt={item[0]} />
                    <div className="recent-info">
                      <span><b>{item[1]}</b></span><br />
                      <span>{item[2]}</span>
                    </div>
                  </div>
                )) : (
                  <div><h1>Sem vídeos recentes</h1></div>
                )}
              </div>
            ) : null
          }
          <button onClick={() => setShowVideo(!showVideo)}>
            <i style={{ color: showVideo ? "var(--items-color)" : undefined }} className="bx bxl-youtube"></i>
          </button>
          <button onClick={() => {
            const music_id = `${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours()}${new Date().getMinutes()}${new Date().getSeconds()}${new Date().getMilliseconds()}${process.hrtime()[1]}`;
            setFavorite([...favorite, { image: videoData[0], title: videoData[1], author: videoData[2], duration: videoData[3], url: videoData[4], id: music_id }]);
            localStorage.setItem('favorite', JSON.stringify([...favorite, { image: videoData[0], title: videoData[1], author: videoData[2], duration: videoData[3], url: videoData[4], id: music_id }]));
          }}>
            <i className="bx bxs-heart"></i>
          </button>
        </div>
      </div>
      {loading && <div className="loading">Carregando...</div>}
          </>
        ) : 
        (
          <>
            <div>
              <span>As melhores musicas direito do youtube</span>
            </div>
          </>
        )
      }
    </div>
  );
};

const Favorite = ({ favorite, setVideoURL, setFavorite, videoData, views }) => {
  const Remove = (id) => {
    const indexToRemove = favorite.findIndex(item => item.id === id);
    if (indexToRemove !== -1) {
      const updatedFavorites = [...favorite];
      updatedFavorites.splice(indexToRemove, 1);
      setFavorite(updatedFavorites);
      localStorage.setItem('favorite', JSON.stringify(updatedFavorites));
    }
  };

  const verif_view = (id) => {
    return views.some(view => view[5] === id);
  };

  return (
    <div className="favorite-list">
      {favorite.map((item, index) => (
        <div key={index} className={`favorite-item ${videoData[5] === item.id ? "active" : ""} ${verif_view(item.id) ? "viewed" : ""}`} onDoubleClick={() => { setVideoURL(item.url, item.id) }}>
          <img src={item.image} width={40} height={40} alt={item.title} />
          <span>{item.title}</span>
          <span>{item.author}</span>
          <span>{item.duration}</span>
          <span>
            <button onClick={() => { setVideoURL(item.url, item.id) }}><i className="bx bx-play"></i></button>
            <button onClick={() => { Remove(item.id) }}><i className="bx bxs-trash"></i></button>
          </span>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [videoId, setVideoId] = useState('');
  const [videoData, setVideoData] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [favorite, setFavorite] = useState([]);
  const [isPaused, setPaused] = useState(true);
  const [views, setView] = useState([]);
  const [loading, setLoading] = useState(false); // Adicionando estado de carregamento
  const [index, setIndex] = useState(false)
  const playerRef = useRef(null);

  useEffect(() => {
    if (index) {
      const currentIndex = favorite.findIndex(item => item.id === videoData[5]);
      if (currentIndex !== -1 && currentIndex < favorite.length - 1) {
        setVideoURL(favorite[currentIndex + 1].url, favorite[currentIndex + 1].id);
      }
      setIndex(false);
    }
  }, [index]);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubePlayerAPIReady = () => {
      playerRef.current = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: '',
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    };
    const storedFavorites = JSON.parse(localStorage.getItem('favorite')) || [];
    setFavorite(storedFavorites);
  }, []);

  const onPlayerReady = (event) => {
    event.target.playVideo();
    setInterval(updateProgressBar, 1000);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.ENDED) {
      setPaused(true)
      setIndex(true)
    }
  };


  const setVideoURL = (videoURL, id = null) => {
    setLoading(true); // Inicia o carregamento
    const videoId = extractVideoId(videoURL);
    if (videoId) {
      playerRef.current.loadVideoById(videoId);
      const thumbnailURL = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      document.getElementById('videoThumbnail').src = thumbnailURL;
      document.getElementById('videoThumbnail').style.display = 'block';

      setPaused(false);

      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = thumbnailURL;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const base64Image = canvas.toDataURL("image/jpeg");

        playerRef.current.addEventListener('onStateChange', (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            const videoTitle = playerRef.current.getVideoData().title;
            const videoAuthor = playerRef.current.getVideoData().author;
            const videoDuration = formatTime(playerRef.current.getDuration());

            setVideoData([base64Image, videoTitle, videoAuthor, videoDuration, videoURL, id]);

            if (!views.some(view => view[1] === videoTitle)) {
              setView([...views, [base64Image, videoTitle, videoAuthor, videoDuration, videoURL, id]]);
            }

            setLoading(false); // Desliga o carregamento
          }
        });
      };

    } else {
      alert('Link inválido! Certifique-se de fornecer um link válido do YouTube.');
      setLoading(false); // Desliga o carregamento caso link inválido
    }
  };

  const updateProgressBar = () => {
    if (playerRef.current && playerRef.current.getDuration) {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      const progress = (currentTime / duration) * 100;

      document.getElementById('progress-bar').value = progress;
      document.getElementById('time_in').textContent = formatTime(currentTime);
      document.getElementById('time_out').textContent = formatTime(duration);
    }
  };

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <main>
      <Top setVideoURL={setVideoURL} />
      <div className="body">
        <div className="options">
          <div>
            <button>
              <i className="bx bx-music"></i>
              <span>Musicas</span>
            </button>
            <button className="active">
              <i className="bx bx-heart"></i>
              <span>Favoritos</span>
            </button>
            <button>
              <i className="bx bxs-playlist"></i>
              <span>Playlist</span>
            </button>
            <button>
              <i className="bx bx-cog"></i>
              <span>Definicoes</span>
            </button>
          </div>
          <div>
            <button>Playlist</button>
          </div>
        </div>
        <div className="content">
          <Left videoData={videoData} />
          <Favorite favorite={favorite} setVideoURL={setVideoURL} setFavorite={setFavorite} videoData={videoData} views={views} />
          <div className="player" style={{ display: showVideo ? 'flex' : 'none' }}>
            <div id="player"></div>
          </div>
        </div>
      </div>
      <Bottom
        playerRef={playerRef}
        setShowVideo={setShowVideo}
        showVideo={showVideo}
        videoData={videoData}
        setVideoURL={setVideoURL}
        setFavorite={setFavorite}
        favorite={favorite}
        isPaused={isPaused}
        setPaused={setPaused}
        views={views}
        setView={setView}
        loading={loading}
      />
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
