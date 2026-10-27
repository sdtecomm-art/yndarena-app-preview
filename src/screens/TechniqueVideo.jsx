import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui.jsx';
import { ItemIcon } from '../components.jsx';

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

export function techniqueVideo(t) {
  return devFixture(t) || t.video || { status: 'pending', segments: [], shotPlan: [] };
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

  if (!ready) {
    return (
      <div className="vplayer is-pending">
        <div className="vplayer-frame">
          <div className="vplayer-still">
            <ItemIcon type={t.demoType} style={t.demoStyle} size={150} />
            <span className="photo-tag">Illustration of the result, not a demonstration</span>
          </div>
          <div className="vplayer-pending">
            <span className="tag is-lav">Video pending</span>
            <p>The demonstration has not been recorded yet. Use the written steps below for now.</p>
          </div>
        </div>
        <div className="vplayer-bar" aria-disabled="true">
          <button disabled aria-label="Play"><Icon name="play" size={20} /></button>
          <button disabled aria-label="Repeat"><Icon name="undo" size={18} /></button>
          <button disabled className="vplayer-speed">0.5×</button>
          <div className="vplayer-track"><i style={{ width: 0 }} /></div>
          <span className="vplayer-time">–:––</span>
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
