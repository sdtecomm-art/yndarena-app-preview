import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNav } from './nav.jsx';
import { WORDMARK } from './assets.js';

// ---------- Icons ----------
const P = {
  home: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z',
  discover: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm3.6-12.6-2.1 5.1-5.1 2.1 2.1-5.1z',
  collection: 'M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.5L5 21V4.5a1 1 0 0 1 1-1z',
  care: 'M12 3.5c3.2 4 5.5 7.3 5.5 10.2a5.5 5.5 0 0 1-11 0c0-2.9 2.3-6.2 5.5-10.2z',
  back: 'M15 5l-7 7 7 7',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrow: 'M5 12h13M13 6l6 6-6 6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.5 3.2-5.5 6.5-5.5s5.9 2 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.5 3.5 5.2',
  share: 'M12 15V3.5M7.5 8 12 3.5 16.5 8M5 12v7.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V12',
  search: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM16 16l5 5',
  rotate: 'M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4.5H15',
  copy: 'M8 8h11v11H8zM5 15.5H4V4.5h11v1',
  trash: 'M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13',
  undo: 'M9 14 4.5 9.5 9 5M4.5 9.5H14a5.5 5.5 0 0 1 0 11h-3',
  redo: 'M15 14l4.5-4.5L15 5M19.5 9.5H10a5.5 5.5 0 0 0 0 11h3',
  layers: 'M12 3.5 21 8l-9 4.5L3 8zM3 12.5l9 4.5 9-4.5M3 16.5 12 21l9-4.5',
  list: 'M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  play: 'M8 5.5v13l10.5-6.5z',
  star: 'M12 3.8l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.4l-5.1 2.8 1.1-5.6-4.2-3.9 5.7-.7z',
  gift: 'M4 10h16v10.5H4zM3 6.5h18V10H3zM12 6.5v14M12 6.5C10.5 3 7 3 7 5s3 1.5 5 1.5zM12 6.5C13.5 3 17 3 17 5s-3 1.5-5 1.5z',
  calendar: 'M4 5.5h16v15H4zM4 10h16M8.5 3v4.5M15.5 3v4.5',
  camera: 'M4 7.5h3.5L9 5h6l1.5 2.5H20v12H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  note: 'M5 3.5h10l4 4V20.5H5zM14.5 3.5V8H19M8.5 12.5h7M8.5 16h5',
  edit: 'M15 4.5l4.5 4.5L9 19.5H4.5V15z',
  drop: 'M12 3.5c3.2 4 5.5 7.3 5.5 10.2a5.5 5.5 0 0 1-11 0c0-2.9 2.3-6.2 5.5-10.2z',
  bell: 'M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5zM10 20.5h4',
  swap: 'M7 4.5 3.5 8 7 11.5M3.5 8H17M17 12.5l3.5 3.5-3.5 3.5M20.5 16H7',
  shuffle: 'M3.5 7h3.5c4 0 6 10 10 10h3.5M17.5 14l3 3-3 3M3.5 17H7c1.4 0 2.6-1.2 3.6-2.8M13.4 9.8C14.4 8.2 15.6 7 17 7h3.5M17.5 4l3 3-3 3',
  save: 'M5 3.5h11.5L20 7v13.5H4V3.5zM8 3.5V9h8V3.5M7.5 20.5v-6h9v6',
  bag: 'M5 8h14l-1 12.5H6zM9 8V6.5a3 3 0 0 1 6 0V8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5.5M12 7.5h.01',
  mail: 'M3.5 6h17v12.5h-17zM3.5 6.5l8.5 6.5 8.5-6.5',
  chevron: 'M9 5l7 7-7 7',
  more: 'M5.5 12h.01M12 12h.01M18.5 12h.01',
};

export function Icon({ name, size = 22, stroke = 1.5, fill = 'none', className = '' }) {
  return (
    <svg className={'icon ' + className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name]} />
    </svg>
  );
}

// ---------- Brand ----------
export function Sprig({ className = '', color, style }) {
  return <span className={'sprig ' + className} style={{ ...(color ? { background: color } : {}), ...style }} aria-hidden="true" />;
}

export function Wordmark({ height = 40 }) {
  return <img className="wordmark" src={WORDMARK} alt="Yndarena, turning houses into homes" style={{ height }} />;
}

// ---------- Buttons ----------
export function Button({ children, variant = 'primary', arrow = false, small = false, block = false, icon, className = '', ...rest }) {
  return (
    <button className={`btn btn-${variant}${small ? ' btn-sm' : ''}${block ? ' btn-block' : ''} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {arrow && (
        <span className="btn-arrow"><Icon name="arrow" size={16} /></span>
      )}
    </button>
  );
}

export function IconButton({ name, label, onClick, className = '', active, disabled, size = 22 }) {
  return (
    <button className={'icon-btn ' + className + (active ? ' is-active' : '')} onClick={onClick} aria-label={label} title={label} disabled={disabled}>
      <Icon name={name} size={size} />
    </button>
  );
}

export function Kicker({ children, className = '' }) {
  return <div className={'kicker ' + className}>{children}</div>;
}

export function Chip({ children, active, onClick, className = '' }) {
  return (
    <button className={'chip' + (active ? ' is-active' : '') + ' ' + className} onClick={onClick} aria-pressed={!!active}>
      {children}
    </button>
  );
}

export function Segmented({ options, value, onChange, className = '' }) {
  return (
    <div className={'segmented ' + className} role="tablist">
      {options.map((o) => (
        <button key={o.id} role="tab" aria-selected={value === o.id} className={value === o.id ? 'is-active' : ''} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stepper({ value, onDec, onInc, label }) {
  return (
    <div className="stepper">
      <button onClick={onDec} aria-label="Less"><Icon name="minus" size={16} /></button>
      <span>{label ?? value}</span>
      <button onClick={onInc} aria-label="More"><Icon name="plus" size={16} /></button>
    </div>
  );
}

export function Stars({ value, onChange, size = 26 }) {
  return (
    <div className="stars" role={onChange ? 'radiogroup' : undefined}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange && onChange(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} className={n <= value ? 'on' : ''}>
          <Icon name="star" size={size} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

export function DemoNote({ children, className = '' }) {
  return (
    <div className={'demo-note ' + className}>
      <span className="demo-dot" />
      <span>{children}</span>
    </div>
  );
}

export function Meta({ icon, children }) {
  return (
    <span className="meta">
      <Icon name={icon} size={15} />
      {children}
    </span>
  );
}

// ---------- Screen chrome ----------
export function TopBar({ title, onBack, right, transparent, close }) {
  const nav = useNav();
  const back = onBack || (() => nav.pop());
  return (
    <header className={'topbar' + (transparent ? ' is-transparent' : '')}>
      <IconButton name={close ? 'close' : 'back'} label={close ? 'Close' : 'Back'} onClick={back} />
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">{right}</div>
    </header>
  );
}

export function Screen({ children, className = '', bar }) {
  return (
    <div className={'screen ' + className}>
      {bar}
      <div className="screen-scroll">{children}</div>
    </div>
  );
}

// Two-step confirmation inside the UI (no native dialogs, which some webviews block).
export function ConfirmTap({ render, onConfirm, ms = 3500 }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), ms); return () => clearTimeout(t); }, [armed, ms]);
  return render(armed, () => { if (armed) { setArmed(false); onConfirm(); } else setArmed(true); });
}

// ---------- Sheet ----------
export function Sheet({ open, onClose, title, children, tall }) {
  const [show, setShow] = useState(open);
  useEffect(() => { if (open) setShow(true); }, [open]);
  if (!show) return null;
  // Sheets render above the tab bar, inside the phone frame.
  const host = document.getElementById('sheet-root') || document.body;
  return createPortal(
    <div className={'sheet-wrap' + (open ? ' is-open' : ' is-closing')} onAnimationEnd={() => !open && setShow(false)}>
      <div className="sheet-scrim" onClick={onClose} />
      <div className={'sheet' + (tall ? ' is-tall' : '')} role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-grip" />
        {title && (
          <div className="sheet-head">
            <h3>{title}</h3>
            <IconButton name="close" label="Close" onClick={onClose} />
          </div>
        )}
        <div className="sheet-body">{children}</div>
      </div>
    </div>,
    host,
  );
}

// ---------- Toast ----------
const ToastCtx = createContext({ show: () => {}, toast: null });
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const t = useRef();
  const show = useCallback((msg) => {
    setToast({ msg, k: Date.now() });
    clearTimeout(t.current);
    t.current = setTimeout(() => setToast(null), 2600);
  }, []);
  return <ToastCtx.Provider value={{ show, toast }}>{children}</ToastCtx.Provider>;
}
export function ToastHost() {
  const { toast } = useContext(ToastCtx);
  return toast ? <div key={toast.k} className="toast" role="status">{toast.msg}</div> : null;
}
export const useToast = () => useContext(ToastCtx).show;

// ---------- Media ----------
export function PhotoPending({ children, className = '' }) {
  return (
    <div className={'photo-pending ' + className}>
      {children}
      <span className="photo-tag">Photo pending</span>
    </div>
  );
}

export async function readPhoto(file) {
  const url = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const max = 720, k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.72);
}

export function Empty({ title, children, action }) {
  return (
    <div className="empty">
      <Sprig className="empty-sprig" />
      <h4>{title}</h4>
      <p>{children}</p>
      {action}
    </div>
  );
}
