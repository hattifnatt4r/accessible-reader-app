import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import './AudioMessage.css';

const BAR_COUNT = 50;

interface Props {
  url: string;
  own?: boolean;
}

export const AudioMessage = ({ url, own }: Props) => {
  const [bars, setBars] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url, { credentials: 'include' })
      .then(r => r.arrayBuffer())
      .then(buf => {
        const ctx = new AudioContext();
        return ctx.decodeAudioData(buf).then(decoded => { ctx.close(); return decoded; });
      })
      .then(decoded => {
        if (cancelled) return;
        const data = decoded.getChannelData(0);
        const blockSize = Math.floor(data.length / BAR_COUNT);
        const result: number[] = [];
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(data[i * blockSize + j]);
          }
          result.push(sum / blockSize);
        }
        const max = Math.max(...result, 0.001);
        setBars(result.map(v => v / max));
      })
      .catch(() => {
        if (!cancelled) setBars(Array(BAR_COUNT).fill(0.4));
      });
    return () => { cancelled = true; };
  }, [url]);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    setProgress(audio.currentTime / audio.duration);
    setDuration(audio.duration);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const el = e.currentTarget;
    if (!isFinite(el.duration)) {
      el.currentTime = 1e101;
      el.ontimeupdate = () => { el.ontimeupdate = null; el.currentTime = 0; };
    } else {
      setDuration(el.duration);
    }
  };

  const playedBars = Math.floor(progress * BAR_COUNT);

  return (
    <div className={'audio-msg' + (own ? ' audio-msg_own' : '')}>
      <button className="audio-msg__btn" onClick={togglePlay}>
        <Icon name={isPlaying ? 'pause' : 'play_arrow'} />
      </button>
      <div className="audio-msg__waveform">
        {bars.map((v, i) => (
          <div
            key={i}
            className={'audio-msg__bar' + (i < playedBars ? ' audio-msg__bar_played' : '')}
            style={{ height: `${Math.max(3, v * 36)}px` }}
          />
        ))}
      </div>
      <span className="audio-msg__duration">{formatDuration(duration)}</span>
      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => { setIsPlaying(false); setProgress(0); }}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </div>
  );
};
