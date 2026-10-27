import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui.jsx';
import { ItemIcon } from '../components.jsx';
import { MEDIA } from '../data/media.js';
import { VIDEOS, videoReady } from '../data/videos.js';

export const stepOf = (s) => (typeof s === 'string' ? { text: s } : s);

// Development only: lets the player be tested with a local test pattern.
// The production build drops this branch, so a fixture can never ship as a demonstration.
function devFixture(t) {
  if (!import.meta.env.DEV) return null;
  let src = null;
  try { src = localStorage.getItem('ynd-video-fixture'); } catch (e) { /* ignore */ }
  if (!src) return null;
  return { status: 'ready', src, poster: null, captions: null, fixture: true, segments: t.steps.map((_, i) => ({ step: i, start: i * 2, end: i * 2 + 2 })) };
}

// Registry entry (videos.js) merged with the technique's own shot plan, in the shape the player uses.
export function techniqueVideo(t, id) {
  const fixture = devFixture(t);
  if (fixture) return fixture;
  const v = VIDEOS[id] || {};
  const poster = v.poster ? MEDIA[v.poster] : null;
  return {
    status: videoReady(v) ? 'ready' : 'pending',
    src: v.videoSrc || null,
    captions: v.captionsSrc || null,
    poster: videoReady(v) && poster ? poster.src : null,
    resultImage: poster,
    segments: v.segments || [],
    shotPlan: t.video?.shotPlan || [],
  };
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

// Video is attached only when the person presses play, so nothing downloads on entry.
export function TechniqueVideo({ t, video, seg, onSeg }) {
  const ref = useRef();
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [cc, setCc] = useState(true);
  const ready = video.status === 'ready' && video.src;
  const segment = seg != null ? video.segments.find((s) => s.step === seg) : null;

  useEffect(() => { if (ref.current) ref.current.playbackRate = slow ? 0.5 : 1; }, [slow, started]);
  useEffect(() => {
    if (!segment || !ref.current || !started) return;
    ref.current.currentTime = segment.start;
    ref.current.play();
  }, [seg]); // eslint-disable-line

  // No clip yet: the finished result and the written steps. No playback controls until a video exists.
  if (!ready) {
    const img = video.resultImage;
    return (
      <div className="vplayer is-pending">
        <div className="vplayer-frame result-frame">
          <div className="vplayer-still">
            {img ? <img src={img.src} alt={img.alt} className="result-img" decoding="async" /> : <ItemIcon type={t.demoType} style={t.demoStyle} size={170} />}
            <span className="photo-tag">The result · AI image</span>
          </div>
        </div>
        <div className="vplayer-note">
          <span className="tag is-lav">Video coming soon</span>
          <p>This shows the finished result, not the movement. Follow the written steps below for now.</p>
        </div>
      </div>
    );
  }

  const play = () => {
    if (!started) { setStarted(true); return; }
    const v = ref.current;
    if (v.paused) v.play(); else v.pause();
  };
  const restart = () => {
    const v = ref.current;
    if (!v) { setStarted(true); return; }
    v.currentTime = segment ? segment.start : 0;
    v.play();
  };
  const onTime = () => {
    const v = ref.current;
    setTime(v.currentTime);
    if (segment && v.currentTime >= segment.end) {
      if (repeat) v.currentTime = segment.start;
      else { v.pause(); v.currentTime = segment.end; }
    }
  };

  return (
    <div className="vplayer">
      {import.meta.env.DEV && video.fixture && <div className="vplayer-fixture">Test pattern for checking the player. Not a demonstration.</div>}
      <div className="vplayer-frame" onClick={play}>
        {started ? (
          <video
            ref={ref}
            src={video.src}
            poster={video.poster || undefined}
            preload="metadata"
            playsInline
            autoPlay
            loop={repeat && !segment}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onLoadedMetadata={(e) => { setDur(e.target.duration); e.target.playbackRate = slow ? 0.5 : 1; if (segment) e.target.currentTime = segment.start; }}
            onTimeUpdate={onTime}
          >
            {video.captions && <track kind="captions" src={video.captions} srcLang="en" label="English" default={cc} />}
          </video>
        ) : (
          <div className="vplayer-still" style={video.poster ? { backgroundImage: `url(${video.poster})` } : undefined}>
            {!video.poster && <ItemIcon type={t.demoType} style={t.demoStyle} size={150} />}
            <span className="vplayer-big"><Icon name="play" size={26} /></span>
          </div>
        )}
      </div>
      <div className="vplayer-bar">
        <button onClick={play} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg> : <Icon name="play" size={20} />}
        </button>
        <button onClick={restart} aria-label={segment ? 'Replay this step' : 'Replay from the start'}><Icon name="undo" size={18} /></button>
        <button className={'vplayer-speed' + (slow ? ' is-on' : '')} onClick={() => setSlow(!slow)} aria-pressed={slow} aria-label="Slow motion">0.5×</button>
        <button className={'vplayer-speed' + (repeat ? ' is-on' : '')} onClick={() => setRepeat(!repeat)} aria-pressed={repeat} aria-label="Repeat">Loop</button>
        <div className="vplayer-track" onClick={(e) => { const v = ref.current; if (!v || !dur) return; const r = e.currentTarget.getBoundingClientRect(); v.currentTime = ((e.clientX - r.left) / r.width) * dur; }}>
          {dur > 0 && video.segments.map((s) => <b key={s.step} style={{ left: `${(s.start / dur) * 100}%` }} />)}
          <i style={{ width: dur ? `${(time / dur) * 100}%` : 0 }} />
        </div>
        <span className="vplayer-time">{fmt(time)}</span>
        {video.captions && <button className={'vplayer-speed' + (cc ? ' is-on' : '')} onClick={() => setCc(!cc)} aria-pressed={cc}>CC</button>}
      </div>
      {video.segments.length > 0 && (
        <div className="vplayer-steps">
          {video.segments.map((s) => (
            <button key={s.step} className={'chip' + (seg === s.step ? ' is-active' : '')} onClick={() => { setStarted(true); onSeg(seg === s.step ? null : s.step); }}>
              {s.step + 1}. {stepOf(t.steps[s.step]).title || `Step ${s.step + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
