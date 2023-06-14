import React, { useEffect, useRef, useState } from "react";
import {
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward
} from "react-icons/fa";
import "../styles/MusicPlayer.css";

function MusicPlayer({ selected }) {
  const [isLove, setLove] = useState(false);
  const [isPlaying, setPlay] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();
  const isFirstRender = useRef(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (
      audioPlayer.current &&
      audioPlayer.current.duration &&
      !isNaN(audioPlayer.current.duration)
    ) {
      const seconds = Math.floor(audioPlayer.current.duration);
      setDuration(seconds);

      progressBar.current.max = seconds;
    }
  }, [audioPlayer?.current?.canplaythrough]);

  useEffect(() => {
    if (!isFirstRender.current) {
      setPlay(false);

      if (selected) {
        audioPlayer.current.src = selected.preview;
        audioPlayer.current.load();
        setCurrentSong(selected);
      }
    } else {
      isFirstRender.current = false;
    }
  }, [selected, currentIndex]);

  useEffect(() => {
    if (audioPlayer.current && currentSong) {
      setPlay(true);
      audioPlayer.current.play();
    } else {
      setPlay(false);
    }
  }, [currentSong]);

  const changePlayPause = () => {
    const prevValue = isPlaying;
    setPlay(!prevValue);

    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (audioPlayer.current && audioPlayer.current.currentTime) {
      progressBar.current.value = audioPlayer.current.currentTime;

      changeCurrentTime();

      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnMin} : ${returnSec}`;
  };

  const changeProgress = () => {
    if (audioPlayer.current) {
      audioPlayer.current.currentTime = progressBar.current.value;

      progressBar.current.style.setProperty(
        "--played-width",
        `${(progressBar.current.value / duration) * 100}%`
      );

      changeCurrentTime();
    }
  };

  const changeCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--played-width",
      `${(progressBar.current.value / duration) * 100}%`
    );

    setCurrentTime(progressBar.current.value);
  };

  const changeSongLove = () => {
    setLove(!isLove);
  };

  const playNextSong = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const playPreviousSong = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <div className="musicPlayer">
      <div className="songImage">
        <img
          src={
            currentSong?.image || "https://api.deezer.com/album/6157080/image"
          }
          alt=""
        />
      </div>
      <div className="songAttributes">
        <audio
          ref={audioPlayer}
          src={currentSong?.preview}
          preload="metadata"
        />

        <div className="top">
          <div className="middle">
            <div className="back" onClick={playPreviousSong}>
              <i>
                <FaStepBackward />
              </i>
              <i>
                <FaBackward />
              </i>
            </div>
            <div className="playPause" onClick={changePlayPause}>
              {isPlaying ? (
                <i>
                  <FaPause />
                </i>
              ) : (
                <i>
                  <FaPlay />
                </i>
              )}
            </div>
            <div className="forward" onClick={playNextSong}>
              <i>
                <FaForward />
              </i>
              <i>
                <FaStepForward />
              </i>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="currentTime">{calculateTime(currentTime)}</div>
          <input
            type="range"
            className="progressBar"
            ref={progressBar}
            defaultValue="0"
            onChange={changeProgress}
            autoPlay={true}
          />
          <div className="duration">
            {duration && !isNaN(duration) && calculateTime(duration)
              ? duration && !isNaN(duration) && calculateTime(duration)
              : "00:00"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
