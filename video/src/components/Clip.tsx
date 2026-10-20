import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { annotationColor, body, colors, display, H, PAD, W } from '../theme';
import { Annotation, Beat, Narration, Scene, beatFrames, cueTime, sec } from '../timeline';
import { Voice, useRise } from './Common';

const LowerThird: React.FC<{ kicker: string; text: string }> = ({ kicker, text }) => {
  const style = useRise(2);
  return (
    <div style={{ ...style, position: 'absolute', left: 60, bottom: 60, background: 'rgba(11,19,36,0.88)', borderLeft: `8px solid ${colors.accent}`, padding: '18px 30px', borderRadius: 10 }}>
      <div style={{ fontFamily: display, fontSize: 28, letterSpacing: 5, color: colors.accent, fontWeight: 700, textTransform: 'uppercase' }}>{kicker}</div>
      <div style={{ fontFamily: display, fontSize: 52, fontWeight: 700, fontStyle: 'italic', textTransform: 'uppercase' }}>{text}</div>
    </div>
  );
};

const Credit: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', right: 36, bottom: 22, fontSize: 22, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 4px #000' }}>Clip: {text}</div>
);

// Covers parts of the picture that would give the answer away, such as the score.
const Masks: React.FC<{ masks?: number[][] }> = ({ masks }) => (
  <>
    {(masks ?? []).map(([x, y, w, h], i) => (
      <div key={i} style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: colors.bg, borderRadius: 8 }} />
    ))}
  </>
);

// A highlight painted on the grass: a glowing ring under the player's feet, a soft beam of light
// over them, and a name tag on a stem, so the player stays fully visible. `y` is the player's middle,
// `r` roughly half their height; a small `r` marks the ball and gets the ring only.
const Ring: React.FC<{ a: Annotation; p: number; index: number }> = ({ a, p, index }) => {
  const c = annotationColor[a.color] ?? '#fff';
  const r = a.r ?? 40;
  const ball = r < 30;
  const x = a.x!;
  const feet = ball ? a.y! : a.y! + r * 0.85;
  const rx = (ball ? r * 1.3 : r * 1.25) * (0.6 + 0.4 * p);
  const ry = rx * (ball ? 0.5 : 0.36);
  const head = a.y! - r * 1.2;
  const text = (a.label ?? '').toUpperCase();
  const pillW = text.length * 25 + 44;
  const pillH = 54;
  const down = a.labelSide === 'down';
  const pillTop = down ? feet + ry + 34 : head - 40 - pillH;
  const pillX = Math.min(Math.max(x, pillW / 2 + 12), W - pillW / 2 - 12);
  const gid = `beam-${index}`;
  return (
    <g opacity={Math.min(1, p * 1.4)}>
      {!ball ? (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={c} stopOpacity={0.4} />
              <stop offset="1" stopColor={c} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`M ${x - rx} ${feet} L ${x - rx * 0.7} ${head - 10} L ${x + rx * 0.7} ${head - 10} L ${x + rx} ${feet} z`} fill={`url(#${gid})`} opacity={p} />
        </>
      ) : null}
      <ellipse cx={x} cy={feet} rx={rx + 6} ry={ry + 4} fill="none" stroke={c} strokeWidth="14" opacity="0.35" filter="url(#glow)" />
      <ellipse cx={x} cy={feet} rx={rx} ry={ry} fill={c} fillOpacity={0.22} stroke={c} strokeWidth="6" />
      {text ? (
        <g opacity={p}>
          <line x1={x} y1={down ? feet + ry : head - 6} x2={pillX} y2={down ? pillTop : pillTop + pillH} stroke={c} strokeWidth="4" />
          <rect x={pillX - pillW / 2} y={pillTop} width={pillW} height={pillH} rx={pillH / 2} fill="#0b1324" fillOpacity={0.88} stroke={c} strokeWidth="4" />
          <text x={pillX} y={pillTop + 40} textAnchor="middle" fontFamily={display} fontWeight={700} fontSize="40" letterSpacing="2" fill="#fff">
            {text}
          </text>
        </g>
      ) : null}
    </g>
  );
};

const Arrow: React.FC<{ a: Annotation; p: number }> = ({ a, p }) => {
  if (p <= 0) return null;
  const c = annotationColor[a.color] ?? '#fff';
  const [x1, y1] = a.from!;
  const x2 = x1 + (a.to![0] - x1) * p;
  const y2 = y1 + (a.to![1] - y1) * p;
  const angle = Math.atan2(a.to![1] - y1, a.to![0] - x1);
  const head = 36;
  const tip = `M ${x2} ${y2} L ${x2 - head * Math.cos(angle - 0.45)} ${y2 - head * Math.sin(angle - 0.45)} L ${x2 - head * Math.cos(angle + 0.45)} ${y2 - head * Math.sin(angle + 0.45)} z`;
  const dash = a.dashed ? '26 20' : undefined;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0b1324" strokeWidth="17" strokeLinecap="round" opacity="0.45" strokeDasharray={dash} />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="10" strokeLinecap="round" strokeDasharray={dash} />
      {p > 0.9 ? <path d={tip} fill={c} /> : null}
    </g>
  );
};

// A short note placed on the picture, for example next to an arrow.
const Label: React.FC<{ a: Annotation; p: number }> = ({ a, p }) => {
  if (p <= 0) return null;
  const c = annotationColor[a.color] ?? '#fff';
  const text = (a.text ?? '').toUpperCase();
  const w = text.length * 21 + 40;
  const x = Math.min(Math.max(a.x!, w / 2 + 12), W - w / 2 - 12);
  return (
    <g opacity={p} transform={`translate(${x} ${a.y}) scale(${0.85 + 0.15 * p})`}>
      <rect x={-w / 2} y={-26} width={w} height={52} rx={10} fill="#0b1324" fillOpacity={0.88} stroke={c} strokeWidth="4" />
      <text y={12} textAnchor="middle" fontFamily={display} fontWeight={700} fontSize="34" letterSpacing="1" fill={c}>
        {text}
      </text>
    </g>
  );
};

// A shaded triangle, for example from the ball to both goalposts.
const Cone: React.FC<{ a: Annotation; p: number }> = ({ a, p }) => {
  const c = annotationColor[a.color] ?? '#fff';
  const pts = a.points!.map(([x, y]) => `${x},${y}`).join(' ');
  return <polygon points={pts} fill={c} fillOpacity={0.28 * p} stroke={c} strokeOpacity={p} strokeWidth="5" strokeDasharray="18 12" />;
};

const Annotations: React.FC<{ items: Annotation[]; words?: [string, number][] }> = ({ items, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {items.map((a, i) => {
        // A cue ties the drawing to the moment its word is spoken; otherwise a fixed delay.
        const spoken = a.cue ? cueTime(words, a.cue) : null;
        const start = spoken !== null ? sec(PAD.before + spoken) : sec(a.delay ?? 0.3 + i * 0.35);
        const p = a.kind === 'ring'
          ? Math.min(1, spring({ frame: frame - start, fps, config: { damping: 14 } }))
          : interpolate(frame, [start, start + sec(0.8)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (a.kind === 'arrow') return <Arrow key={i} a={a} p={p} />;
        if (a.kind === 'cone') return <Cone key={i} a={a} p={p} />;
        if (a.kind === 'label') return <Label key={i} a={a} p={p} />;
        return <Ring key={i} a={a} p={p} index={i} />;
      })}
    </svg>
  );
};

const Countdown: React.FC<{ from: number; seconds: number }> = ({ from, seconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from) return null;
  const elapsed = frame - from;
  const remaining = Math.max(1, Math.ceil(seconds - elapsed / fps));
  const tick = (elapsed % fps) / fps;
  return (
    <div style={{ position: 'absolute', right: 60, bottom: 90, display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(11,19,36,0.85)', padding: '16px 28px 16px 16px', borderRadius: 80 }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12" />
        <circle cx="60" cy="60" r="50" fill="none" stroke={colors.amber} strokeWidth="12" strokeDasharray={`${314 * (1 - tick)} 314`} transform="rotate(-90 60 60)" strokeLinecap="round" />
        <text x="60" y="78" textAnchor="middle" fontFamily={display} fontWeight={700} fontSize="56" fill="#fff">{remaining}</text>
      </svg>
      <div style={{ fontSize: 34, fontWeight: 600 }}>Say your answer.</div>
    </div>
  );
};

const Freeze: React.FC<{ epId: string; scene: Scene; beat: Beat; index: number; n: Narration; total: number }> = ({ epId, scene, beat, index, n, total }) => {
  const talk = total - sec(beat.countdown ?? 0);
  return (
    <AbsoluteFill>
      <Img src={staticFile(`stills/${epId}-${scene.id}-${index}.png`)} style={{ width: W, height: H }} />
      <Masks masks={beat.masks} />
      <Annotations items={beat.annotations ?? []} words={beat.vo ? n[`${scene.id}.${index}`]?.words : undefined} />
      <div style={{ position: 'absolute', [scene.pausedSide === 'right' ? 'right' : 'left']: 36, top: 30, background: colors.red, color: '#fff', fontFamily: display, fontWeight: 700, fontSize: 44, letterSpacing: 6, padding: '4px 24px', borderRadius: 10 }}>PAUSED</div>
      {beat.question ? (
        // A slim strip, placed in empty grass so it never hides the players the question is about.
        <div style={{ position: 'absolute', whiteSpace: 'nowrap', top: beat.questionTop ?? 30, ...(beat.questionSide === 'right' ? { right: 40 } : beat.questionSide === 'left' ? { left: 40 } : { left: '50%', transform: 'translateX(-50%)' }), display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(11,19,36,0.86)', borderLeft: `8px solid ${colors.amber}`, borderRadius: 12, padding: '10px 26px' }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 24, letterSpacing: 5, color: colors.amber }}>YOU CHOOSE</div>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 46, fontStyle: 'italic', textTransform: 'uppercase' }}>{beat.question}</div>
        </div>
      ) : null}
      {beat.countdown ? <Countdown from={talk} seconds={beat.countdown} /> : null}
      {beat.caption ? <Caption text={beat.caption} top={beat.captionTop} /> : null}
      {beat.lowerThird ? <LowerThird kicker={beat.lowerThird} text={scene.label} /> : null}
      <Credit text={scene.credit} />
      {beat.vo ? <Voice n={n} k={`${scene.id}.${index}`} /> : null}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string; top?: boolean | number }> = ({ text, top }) => {
  const style = useRise(sec(1.5));
  return (
    <div style={{ ...style, position: 'absolute', left: '50%', ...(top ? { top: typeof top === 'number' ? top : 130 } : { bottom: 70 }), transform: `${style.transform} translateX(-50%)`, background: 'rgba(11,19,36,0.9)', borderLeft: `8px solid ${colors.amber}`, borderRadius: 12, padding: '16px 34px', fontSize: 50, fontWeight: 800, color: colors.amber, whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
};

const Play: React.FC<{ scene: Scene; beat: Beat }> = ({ scene, beat }) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile(scene.src)} trimBefore={sec(beat.from!)} playbackRate={beat.rate ?? 1} volume={beat.volume ?? 0.3} style={{ width: W, height: H }} />
    <Masks masks={beat.masks} />
    {beat.rate && beat.rate < 1 ? (
      <div style={{ position: 'absolute', right: 36, top: 30, background: 'rgba(11,19,36,0.85)', color: colors.amber, fontFamily: display, fontWeight: 700, fontSize: 36, letterSpacing: 4, padding: '4px 20px', borderRadius: 10 }}>SLOW MOTION</div>
    ) : null}
    {beat.lowerThird ? <LowerThird kicker={beat.lowerThird} text={scene.label} /> : null}
    <Credit text={scene.credit} />
  </AbsoluteFill>
);

export const ClipScene: React.FC<{ epId: string; scene: Scene; n: Narration }> = ({ epId, scene, n }) => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: '#000', color: colors.ink, fontFamily: body }}>
      {scene.beats.map((beat: Beat, i: number) => {
        const length = beatFrames(scene, i, n);
        const from = t;
        t += length;
        return (
          <Sequence key={i} from={from} durationInFrames={length} name={`${scene.id}-${i}-${beat.t}`}>
            {beat.t === 'play' ? <Play scene={scene} beat={beat} /> : <Freeze epId={epId} scene={scene} beat={beat} index={i} n={n} total={length} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
