import { useStore } from '../store.jsx';
import { Button, Sprig } from '../ui.jsx';

const BENEFITS = [
  { title: 'Beautiful ways to share', text: 'Discover creative serving ideas, with everything you need to make them your own.' },
  { title: 'Care that stays with you', text: 'Know when and how to care for your board, with guidance and timely reminders.' },
  { title: 'Thoughtful gifts, right on time', text: 'Keep special dates close, with reminders to help you plan your next gift.' },
];

export default function Welcome({ onDone }) {
  const { homeNo, updateUser } = useStore();
  return (
    <div className="auth">
      <div className="light-window" />
      <div className="auth-inner" style={{ position: 'relative' }}>
        <div className="trio" style={{ marginTop: 18 }}>
          <Sprig className="sprout" /><Sprig className="sprout" /><Sprig className="sprout" />
        </div>
        <h1 style={{ marginTop: 22 }}>Welcome to Home No.&nbsp;{homeNo}.</h1>
        <p className="quote" style={{ marginTop: 10, color: 'var(--c-brown)' }}>Let’s make memories.</p>
        <div style={{ marginTop: 22 }}>
          <div className="kicker" style={{ marginBottom: 6 }}>Included in your Home</div>
          {BENEFITS.map((b, i) => (
            <div className="welcome-benefit" key={b.title} style={{ animationDelay: `${0.3 + i * 0.18}s` }}>
              <span className="num">0{i + 1}</span>
              <div>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <Button block onClick={() => { updateUser((u) => { u.welcomed = true; }); onDone?.(); }}>Explore your Home</Button>
        </div>
      </div>
    </div>
  );
}
