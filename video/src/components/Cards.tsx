import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { colors, display } from '../theme';
import { Episode, Narration, Scene, sec, stepFrames } from '../timeline';
import { Backdrop, Bolt, CueChip, Footer, Heading, Kicker, Sub, Voice, useRise } from './Common';
import { Board, PassBackStory } from './Pitch';

export const TitleCard: React.FC<{ ep: Episode; scene: Scene; n: Narration }> = ({ ep, scene, n }) => (
  <Backdrop>
    <div style={{ position: 'absolute', left: 120, top: 230, width: 1500, display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div style={{ ...useRise(0), display: 'flex', alignItems: 'center', gap: 18 }}>
        <Bolt size={64} />
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44, letterSpacing: 10, color: '#e2e8f0' }}>BLUE THUNDER FILM ROOM</div>
      </div>
      <Kicker>{ep.series} · Episode {ep.number}</Kicker>
      <Heading size={170}>{ep.title}</Heading>
      <div style={{ marginTop: 20 }}>
        {ep.cue ? <CueChip cue={ep.cue} at={20} /> : null}
      </div>
    </div>
    <Footer text="Team Blue Thunder · U12 · Watch · Choose · Explain" />
    <Voice n={n} k={`${scene.id}.vo`} />
  </Backdrop>
);

const StepText: React.FC<{ index: number; count: number; heading: string; sub: string; kicker?: string }> = ({ index, count, heading, sub, kicker }) => (
  <div style={{ position: 'absolute', left: 110, top: 250, width: 640, display: 'flex', flexDirection: 'column', gap: 28 }}>
    <Kicker color={colors.amber}>{kicker ?? (index < 4 ? `Step ${index + 1} of 4` : 'For keepers')}</Kicker>
    <Heading size={104}>{heading}</Heading>
    <Sub>{sub}</Sub>
    <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: i === index ? 56 : 20, height: 10, borderRadius: 5, background: i === index ? colors.amber : 'rgba(255,255,255,0.2)' }} />
      ))}
    </div>
  </div>
);

// All the steps share one pitch, so players carry on from where the last step left them.
export const StepsScene: React.FC<{ scene: Scene; n: Narration }> = ({ scene, n }) => {
  const frame = useCurrentFrame();
  const pitchIn = useRise(6);
  const starts: number[] = [];
  let t = 0;
  scene.steps.forEach((_: unknown, i: number) => {
    starts.push(t);
    t += stepFrames(scene, i, n);
  });
  let index = starts.length - 1;
  while (index > 0 && frame < starts[index]) index--;
  const step = scene.steps[index];
  const total = stepFrames(scene, index, n);

  return (
    <Backdrop>
      {scene.steps.map((s: any, i: number) => (
        <Sequence key={i} from={starts[i]} durationInFrames={stepFrames(scene, i, n)} layout="none">
          <StepText index={i} count={scene.steps.length} heading={s.heading} sub={s.sub} kicker={s.kicker} />
          <Voice n={n} k={`${scene.id}.${i}`} />
          {s.countdown ? <StepCountdown from={stepFrames(scene, i, n) - sec(s.countdown)} seconds={s.countdown} /> : null}
        </Sequence>
      ))}
      <div style={{ ...pitchIn, position: 'absolute', left: 800, top: 110, width: 1040, height: 852 }}>
        {step.board ? (
          <Board spec={{ view: scene.view, ...step.board }} frame={frame - starts[index]} total={total} />
        ) : (
          <PassBackStory step={{ variant: step.variant, frame: frame - starts[index], total }} />
        )}
      </div>
      <Legend />
    </Backdrop>
  );
};

const StepCountdown: React.FC<{ from: number; seconds: number }> = ({ from, seconds }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const elapsed = frame - from;
  const remaining = Math.max(1, Math.ceil(seconds - elapsed / 30));
  const tick = (elapsed % 30) / 30;
  return (
    <div style={{ position: 'absolute', left: 110, top: 760, display: 'flex', alignItems: 'center', gap: 22 }}>
      <svg width="110" height="110" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12" />
        <circle cx="60" cy="60" r="50" fill="none" stroke={colors.amber} strokeWidth="12" strokeDasharray={`${314 * (1 - tick)} 314`} transform="rotate(-90 60 60)" strokeLinecap="round" />
        <text x="60" y="78" textAnchor="middle" fontFamily={display} fontWeight={700} fontSize="56" fill="#fff">{remaining}</text>
      </svg>
      <div style={{ fontSize: 34, fontWeight: 600, color: '#cbd5e1' }}>Say your answer.</div>
    </div>
  );
};

const Legend: React.FC = () => (
  <div style={{ position: 'absolute', left: 110, bottom: 60, display: 'flex', gap: 34, fontSize: 28, color: colors.muted }}>
    {[
      [colors.blue, 'Us'],
      [colors.red, 'Attacker'],
      [colors.yellow, 'Our keeper'],
    ].map(([c, label]) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: c, border: '3px solid #fff' }} />
        {label}
      </div>
    ))}
  </div>
);

export const RecapCard: React.FC<{ ep: Episode; scene: Scene; n: Narration; total: number }> = ({ ep, scene, n, total }) => {
  const frame = useCurrentFrame();
  const noteIn = interpolate(frame, [0.62 * total, 0.62 * total + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <Backdrop>
      <div style={{ position: 'absolute', left: 120, top: 110 }}>
        <Kicker>Remember</Kicker>
      </div>
      <div style={{ position: 'absolute', left: 120, top: 200, right: 120, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 30 }}>
        {scene.items.map((item: string, i: number) => {
          const at = (0.06 + i * 0.1) * total;
          const p = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const key = i === (scene.highlight ?? 2);
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)`, background: colors.panel, borderTop: `8px solid ${key ? colors.amber : colors.accent}`, borderRadius: 20, padding: '40px 32px', height: 340 }}>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 110, color: key ? colors.amber : colors.accent, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: item.length > 18 ? 46 : 60, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1, marginTop: 26 }}>{item}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 120, right: 120, top: 600, opacity: noteIn, transform: `translateY(${(1 - noteIn) * 30}px)`, display: 'flex', alignItems: 'center', gap: 28, background: 'rgba(245,158,11,0.12)', border: `3px solid ${colors.amber}`, borderRadius: 20, padding: '28px 36px' }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 52, color: colors.amber, fontStyle: 'italic', whiteSpace: 'nowrap' }}>{scene.noteLabel ?? 'ALL OVER THE PITCH'}</div>
        <div style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.3 }}>{scene.note}</div>
      </div>
      <div style={{ position: 'absolute', left: 120, bottom: 110 }}>
        {ep.cue ? <CueChip cue={ep.cue} at={Math.round(0.85 * total)} /> : null}
      </div>
      <Voice n={n} k={`${scene.id}.vo`} />
    </Backdrop>
  );
};

export const CreditsCard: React.FC<{ ep: Episode; scene: Scene; n: Narration }> = ({ ep, scene, n }) => (
  <Backdrop>
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 30 }}>
      <Kicker>{ep.series}</Kicker>
      <Heading size={110}>See you at training</Heading>
      <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {scene.lines.map((l: string) => (
          <div key={l} style={{ fontSize: 30, color: colors.muted }}>{l}</div>
        ))}
      </div>
    </AbsoluteFill>
    <Voice n={n} k={`${scene.id}.vo`} />
  </Backdrop>
);
