import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faPlay,
  faPause,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons"; // Import the settings (cog) icon
import Balloonimage from "./assets/animationgif.gif";
import Balloonlogo from "./assets/Balloon2.png";
import musicFile from "./assets/music1.mp3";
import BalloonBoom from "./BalloonBoom.jsx";
import "./Balloonpop.css";
const Balloonpop = () => {
  const [isGameStarted, setIsGameStarted] = useState(false); // Controls game start
  const [isPaused, setIsPaused] = useState(false); // Controls pause state
  const [isMuted, setIsMuted] = useState(false); // Control setting music
  const [setting, setSetting] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  // Score State
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );
  const audioRef = useRef(null);
  // Update high score if current score is higher
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
  }, [score, highScore]);
  // Game over state if user clicks the boom
  const handleGameOver = () => {
    setIsGameOver(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  const handleRestart = () => {
    setIsGameOver(false);
    setScore(0);
    if (audioRef.current) {
      audioRef.current.play();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsGameStarted(true); // Start the game
      setScore(0);
      audioRef.current.loop = true; // Ensure continuous play
      setIsPaused(false); // Ensure game is not paused when starting
    }
  };

  const handleGameSettings = () => {
    if (audioRef.current) {
      setIsPaused(true);
      audioRef.current.pause(); // Stop music
      audioRef.current.currentTime = 0; // Reset audio position
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      setIsMuted(!isMuted);
      audioRef.current.muted = !isMuted; // Toggle mute
    }
    setSetting(false);
  };

  const handleSetting = () => {
    setSetting(true);
  };

  return (
    <>
      <audio src={musicFile} ref={audioRef}></audio>
      {!isGameStarted ? (
        <div className="game_interface">
          <h1 className="game title1">Balloon</h1>
          <h2 className="game title2">Pop</h2>
          <img src={Balloonlogo} alt="gamelogo" className="gamelogo" />
          <img src={Balloonimage} alt="Balloon img" className="balloonimg" />
          <button type="button" className="play_btn" onClick={handleStart}>
            Play
          </button>

          <button type="button" className="setting_btn" onClick={handleSetting}>
            <FontAwesomeIcon icon={faCog} />
          </button>
          {setting && (
            <div className="setting box">
              <button
                type="button"
                className="togglemusic_btn"
                onClick={handleMute}
              >
                <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
              </button>
            </div>
          )}

          <p className="creatortitle">Designed by Shubho R</p>
          <p className="madebytitle">Made by shubhorwebdev.com</p>
        </div>
      ) : (
        <div className="game_board">
          <h1 className="hg score">
            High Score: <span className="highlight1">{highScore}</span>
          </h1>
          <h2 className="gamescore">
            Score: <span className="highlight2">{score}</span>
          </h2>
          <button
            type="button"
            className="toggle_btn"
            onClick={handleGameSettings}
          >
            <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
          </button>
          {isPaused ? (
            <div className="messagebox">
              <button
                type="button"
                className="mainmenu_btn"
                onClick={() => setIsGameStarted(false)}
              >
                Main menu
              </button>
            </div>
          ) : (
            <>
              {!isGameOver ? (
                <BalloonBoom
                  setScore={setScore}
                  handleGameOver={handleGameOver}
                />
              ) : (
                <div className="gameovercard">
                  <p className="gameovertitle">Game over!</p>
                  <button
                    type="button"
                    className="restartbtn"
                    onClick={handleRestart}
                  >
                    Restart
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Balloonpop;
