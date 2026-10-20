import React from 'react';
import { Easing, interpolate, staticFile } from 'remotion';
import { colors, display } from '../theme';

// Top-down view of our own half: halfway line at the top, our goal at the bottom.
// Units: 1000 wide, 700 deep; the goal mouth runs from x 450 to 550 on y 700.
// Only the area around our box is shown, so the players stay large.
export const VIEW = { x: 140, y: 200, w: 720, h: 590 };

export type Pt = [number, number];

export const lerp = (a: Pt, b: Pt, p: number): Pt => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];

const ease = Easing.inOut(Easing.cubic);

// Progress 0..1 between two fractions of a step, given the step's own frame and length.
export const windowAt = (frame: number, total: number) => (from: number, to: number, easing = ease) =>
  interpolate(frame, [from * total, to * total], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

// The cut-out figures shared with the Training Ground app: us, them, keeper; standing and running.
// The front sheet faces down the picture (toward our goal); the back sheet faces up the pitch.
const SPRITES = [
  { id: 'us-idle', box: '165 30 283 425', sheet: 'front' },
  { id: 'them-idle', box: '632 37 279 420', sheet: 'front' },
  { id: 'keeper-idle', box: '1095 33 282 424', sheet: 'front' },
  { id: 'us-run', box: '191 527 261 452', sheet: 'front' },
  { id: 'them-run', box: '648 518 256 457', sheet: 'front' },
  { id: 'keeper-run', box: '1117 522 258 451', sheet: 'front' },
  { id: 'us-idle-back', box: '188 26 250 447', sheet: 'back' },
  { id: 'them-idle-back', box: '643 28 252 447', sheet: 'back' },
  { id: 'keeper-idle-back', box: '1104 27 246 448', sheet: 'back' },
  { id: 'us-run-back', box: '189 497 235 498', sheet: 'back' },
  { id: 'them-run-back', box: '639 497 239 499', sheet: 'back' },
  { id: 'keeper-run-back', box: '1099 496 240 502', sheet: 'back' },
];

const TEAM_COLOR = { us: colors.blue, them: colors.red, keeper: colors.yellow };

const Defs: React.FC = () => (
  <defs>
    <image id="mini-front" href={staticFile('figures/miniature-players.webp')} width={1536} height={1024} />
    <image id="mini-back" href={staticFile('figures/miniature-players-back.webp')} width={1536} height={1024} />
    {SPRITES.map((s) => (
      <symbol key={s.id} id={`mini-${s.id}`} viewBox={s.box} preserveAspectRatio="xMidYMax meet">
        <use href={`#mini-${s.sheet}`} />
      </symbol>
    ))}
    <pattern id="stripes" width="1000" height="140" patternUnits="userSpaceOnUse">
      <rect width="1000" height="70" fill={colors.pitch} />
      <rect y="70" width="1000" height="70" fill={colors.pitchDark} />
    </pattern>
  </defs>
);

export type View = { x: number; y: number; w: number; h: number };

export const PitchMarkings: React.FC<{ children?: React.ReactNode; view?: View }> = ({ children, view = VIEW }) => (
  <svg viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} style={{ width: '100%', height: '100%', borderRadius: 24, boxShadow: '0 30px 80px rgba(0,0,0,0.45)' }}>
    <Defs />
    <rect x="-300" y="-20" width="1600" height="840" fill="url(#stripes)" />
    <g stroke={colors.line} strokeWidth="4" fill="none">
      <rect x="0" y="0" width="1000" height="700" />
      <path d="M 365 0 A 135 135 0 0 0 635 0" />
      <rect x="203" y="480" width="594" height="220" />
      <rect x="365" y="627" width="270" height="73" />
      <path d="M 410 480 A 90 90 0 0 1 590 480" />
      <circle cx="500" cy="590" r="4" fill={colors.line} />
    </g>
    <rect x="450" y="700" width="100" height="26" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="5" />
    {children}
  </svg>
);

// A Training Ground figure standing at `at` (its feet). `moving` switches to the running pose;
// `up` shows the player from behind, facing up the pitch.
export const Figure: React.FC<{ at: Pt; team: 'us' | 'them' | 'keeper'; label: string; moving?: boolean; faceLeft?: boolean; ghost?: boolean; up?: boolean }> = ({ at, team, label, moving, faceLeft, ghost, up }) => {
  const s = 17;
  const c = TEAM_COLOR[team];
  return (
    <g transform={`translate(${at[0]} ${at[1]})`} opacity={ghost ? 0.35 : 1}>
      <ellipse cx={0.18 * s} cy={0.16 * s} rx={1.18 * s} ry={0.5 * s} fill="#0a2015" opacity={0.3} />
      <ellipse rx={1.24 * s} ry={0.53 * s} fill={c} fillOpacity={0.25} stroke={c} strokeWidth={0.14 * s} strokeDasharray={ghost ? '5 5' : undefined} />
      <g transform={`scale(${faceLeft ? -1 : 1} 1)`}>
        <use href={`#mini-${team}-${moving ? 'run' : 'idle'}${up ? '-back' : ''}`} x={-1.8 * s} y={-4.05 * s} width={3.6 * s} height={4.45 * s} />
      </g>
      <g transform={`translate(0 ${0.75 * s})`}>
        <rect x={-label.length * 9 - 10} y="0" width={label.length * 18 + 20} height="24" rx="8" fill="#122e26" fillOpacity="0.92" />
        <rect x={-label.length * 9 - 10} y="5" width="4" height="14" fill={c} />
        <text y="18" textAnchor="middle" fontFamily={display} fontWeight={700} fontSize="20" fill="#fff">
          {label}
        </text>
      </g>
    </g>
  );
};

export const Ball: React.FC<{ at: Pt; opacity?: number }> = ({ at, opacity = 1 }) => (
  <g opacity={opacity}>
    <ellipse cx={at[0] + 3} cy={at[1] + 5} rx="9" ry="4" fill="#0a2015" opacity="0.35" />
    <circle cx={at[0]} cy={at[1]} r="9" fill="#fff" stroke="#111" strokeWidth="2.5" />
  </g>
);

// Point on a quadratic curve from a to b bending toward control point c.
const quad = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1],
];

// A pass line that draws itself from a to b as p goes 0..1; `curve` bends it toward a control point.
export const PassLine: React.FC<{ a: Pt; b: Pt; p: number; color: string; dashed?: boolean; opacity?: number; curve?: Pt }> = ({ a, b, p, color, dashed, opacity = 1, curve }) => {
  if (p <= 0 || opacity <= 0) return null;
  const pts: Pt[] = [];
  const steps = curve ? 24 : 1;
  for (let i = 0; i <= steps; i++) pts.push(curve ? quad(a, curve, b, (i / steps) * p) : lerp(a, b, (i / steps) * p));
  const end = pts[pts.length - 1];
  const prev = curve ? quad(a, curve, b, Math.max(0, p - 0.05)) : a;
  const angle = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
  const h = 18;
  return (
    <g opacity={opacity}>
      <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? '14 12' : undefined} />
      {p > 0.97 ? (
        <path d={`M ${end[0]} ${end[1]} L ${end[0] - h * Math.cos(angle - 0.5)} ${end[1] - h * Math.sin(angle - 0.5)} L ${end[0] - h * Math.cos(angle + 0.5)} ${end[1] - h * Math.sin(angle + 0.5)} z`} fill={color} />
      ) : null}
    </g>
  );
};

export const Tick: React.FC<{ at: Pt; p: number }> = ({ at, p }) => {
  if (p <= 0) return null;
  return (
    <g transform={`translate(${at[0]} ${at[1]}) scale(${p})`}>
      <circle r="26" fill={colors.green} stroke="#fff" strokeWidth="4" />
      <path d="M -12 0 L -3 10 L 13 -9" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

export const Bubble: React.FC<{ at: Pt; text: string; p: number; color?: string; below?: boolean }> = ({ at, text, p, color = '#fff', below }) => {
  if (p <= 0) return null;
  const w = text.length * 17 + 36;
  const y = below ? at[1] + 40 : at[1] - 136;
  return (
    <g transform={`translate(${at[0]} ${y}) scale(${0.6 + 0.4 * p})`} opacity={p}>
      <rect x={-w / 2} y="0" width={w} height="48" rx="14" fill={color} />
      <path d={below ? 'M -10 0 L 0 -14 L 10 0 z' : 'M -10 48 L 0 62 L 10 48 z'} fill={color} />
      <text y="35" textAnchor="middle" fontFamily={display} fontWeight={700} fontSize="32" fill="#0b1324">
        {text}
      </text>
    </g>
  );
};

export const Cross: React.FC<{ at: Pt; p: number }> = ({ at, p }) => {
  if (p <= 0) return null;
  const s = 20 * p;
  return (
    <g stroke={colors.red} strokeWidth="8" strokeLinecap="round">
      <line x1={at[0] - s} y1={at[1] - s} x2={at[0] + s} y2={at[1] + s} />
      <line x1={at[0] + s} y1={at[1] - s} x2={at[0] - s} y2={at[1] + s} />
    </g>
  );
};

export const Tag: React.FC<{ at: Pt; text: string; p: number; color: string; size?: number }> = ({ at, text, p, color, size = 30 }) => {
  if (p <= 0) return null;
  return (
    <text x={at[0]} y={at[1]} textAnchor="middle" fontFamily={display} fontWeight={700} fontSize={size} fill={color} opacity={p} stroke="#0b1324" strokeWidth="6" paintOrder="stroke">
      {text}
    </text>
  );
};

// ---- The back-pass story, told as one continuous picture across the five steps ----

const D: Pt = [575, 395];
const BALL_AT_D: Pt = [560, 415];
const A0: Pt = [610, 320];
const GK_MID: Pt = [500, 670];
const GK_SIDE: Pt = [395, 650];
const GK_CALL: Pt = [365, 610];
const GOAL_MID: Pt = [500, 712];
const WIDE: Pt = [250, 720];

type Step = { variant: string; frame: number; total: number };

const moving = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]) > 0.5;

export const PassBackStory: React.FC<{ step: Step }> = ({ step }) => {
  const w = windowAt(step.frame, step.total);
  const wPrev = windowAt(step.frame - 1, step.total);
  const v = step.variant;

  // Keeper position: each step starts where the last one finished.
  const keeperAt = (win: typeof w): Pt => {
    if (v === 'look') return lerp(GK_MID, GK_SIDE, win(0.2, 0.4));
    if (v === 'call') return lerp(GK_SIDE, GK_CALL, win(0.5, 0.65));
    if (v === 'side' || v === 'pace') return GK_CALL;
    // keeper step: goal line, then edge of the box, then the side of the goal
    const toLine = lerp(GK_CALL, [500, 688], win(0.05, 0.18));
    const toEdge = lerp(toLine, [500, 500], win(0.35, 0.5));
    return lerp(toEdge, [325, 640], win(0.62, 0.78));
  };
  const keeper = keeperAt(w);
  const keeperMoving = moving(keeper, keeperAt(wPrev));

  // Attacker: presses behind the defender; chases the slow pass in the pace step.
  const attackerAt = (win: typeof w): Pt => {
    if (v !== 'pace') return A0;
    const chase = lerp(A0, [430, 548], win(0.12, 0.44));
    const back = lerp(chase, A0, win(0.5, 0.56));
    return lerp(back, [470, 470], win(0.62, 0.8));
  };
  const attacker = attackerAt(w);
  const attackerMoving = moving(attacker, attackerAt(wPrev));

  let ball: Pt = BALL_AT_D;
  const overlays: React.ReactNode[] = [];
  const above: React.ReactNode[] = [];

  if (v === 'look') {
    const scan = w(0.04, 0.38);
    const angle = interpolate(scan, [0, 0.5, 1], [-40, 40, -10]);
    overlays.push(
      <g key="scan" opacity={interpolate(scan, [0, 0.1, 0.9, 1], [0, 0.55, 0.55, 0.2])} transform={`translate(${D[0]} ${D[1] - 30}) rotate(${angle})`}>
        <path d="M 0 0 L -110 280 A 300 300 0 0 0 110 280 z" fill="rgba(250,204,21,0.35)" />
      </g>,
      <Figure key="ghost" at={GK_MID} team="keeper" label="GK" ghost up />,
      <Tag key="was" at={[GK_MID[0], 765]} text="was here" p={w(0.38, 0.44)} color="#e2e8f0" />,
      <Tag key="is" at={[GK_SIDE[0] - 70, GK_SIDE[1] - 100]} text="is here" p={w(0.4, 0.46)} color={colors.yellow} />,
      <PassLine key="wrong" a={BALL_AT_D} b={[500, 640]} p={w(0.6, 0.68)} color={colors.red} dashed />,
      <Cross key="x" at={[500, 640]} p={w(0.68, 0.72)} />,
      <PassLine key="right" a={BALL_AT_D} b={[GK_SIDE[0] + 18, GK_SIDE[1] - 10]} p={w(0.78, 0.9)} color={colors.green} />,
    );
  }

  if (v === 'call') {
    const keeperSays = w(0.36, 0.42) * (1 - w(0.78, 0.81));
    overlays.push(
      <PassLine key="point" a={[D[0] - 20, D[1] - 50]} b={[D[0] - 80, D[1] - 20]} p={w(0.1, 0.16)} color="#fff" opacity={1 - w(0.3, 0.35)} />,
      <Tag key="wins" at={[500, 250]} text="THE KEEPER'S CALL WINS" p={w(0.46, 0.52) * (1 - w(0.78, 0.81))} color={colors.yellow} size={36} />,
      <PassLine key="ready" a={BALL_AT_D} b={[GK_CALL[0] + 18, GK_CALL[1] - 10]} p={w(0.62, 0.74) * (1 - w(0.78, 0.81))} color={colors.green} dashed />,
      <PassLine key="clear-bad" a={BALL_AT_D} b={[640, 220]} p={w(0.84, 0.9)} color={colors.red} dashed />,
      <Cross key="clear-x" at={[625, 255]} p={w(0.9, 0.92)} />,
      <PassLine key="clear-side" a={BALL_AT_D} b={[175, 240]} curve={[420, 230]} p={w(0.9, 0.98)} color={colors.green} />,
    );
    // Speech bubbles sit above the players so no figure hides the words.
    above.push(
      <Bubble key="d" at={[D[0] - 90, D[1]]} text="KEEPER!" p={w(0.08, 0.14) * (1 - w(0.3, 0.35))} />,
      <Bubble key="gk" at={keeper} text="YES! LEFT SIDE!" p={keeperSays} color={colors.green} below />,
      <Bubble key="away" at={keeper} text="AWAY!" p={w(0.82, 0.86)} color={colors.amber} below />,
    );
    const clear = w(0.9, 0.98);
    if (clear > 0) ball = quad(BALL_AT_D, [420, 230], [175, 240], clear);
  }

  if (v === 'side') {
    const middle = w(0.28, 0.46);
    const side = w(0.58, 0.88);
    if (middle > 0 && side <= 0) ball = lerp(BALL_AT_D, GOAL_MID, middle);
    if (side > 0) ball = side < 0.6 ? lerp(BALL_AT_D, [GK_CALL[0] + 4, GK_CALL[1] + 8], side / 0.6) : lerp([GK_CALL[0] + 4, GK_CALL[1] + 8], WIDE, (side - 0.6) / 0.4);
    overlays.push(
      <PassLine key="m" a={BALL_AT_D} b={GOAL_MID} p={middle} color={colors.red} dashed opacity={side > 0 ? 0.45 : 1} />,
      <PassLine key="s" a={BALL_AT_D} b={WIDE} p={side} color={colors.green} dashed />,
      <Tag key="mt" at={[650, 770]} text="MIDDLE: OWN GOAL" p={w(0.45, 0.48)} color={colors.red} />,
      <Tag key="st" at={[300, 775]} text="SIDE: ROLLS WIDE" p={w(0.86, 0.9)} color={colors.green} />,
    );
  }

  if (v === 'pace') {
    const slow = w(0.1, 0.44, Easing.out(Easing.quad));
    const firm = w(0.6, 0.7);
    if (firm <= 0) ball = lerp(BALL_AT_D, [440, 545], slow);
    else ball = lerp(BALL_AT_D, [GK_CALL[0] + 4, GK_CALL[1] + 8], firm);
    overlays.push(
      <Tag key="slow" at={[650, 560]} text="TOO SLOW" p={w(0.42, 0.46) * (1 - w(0.52, 0.55))} color={colors.red} size={36} />,
      <Tag key="firm" at={[620, 640]} text="FIRM: KEEPER FIRST" p={w(0.72, 0.76)} color={colors.green} size={34} />,
    );
  }

  if (v === 'keeper') {
    ball = BALL_AT_D;
    overlays.push(
      <Cross key="line" at={[500, 700]} p={w(0.18, 0.22) * (1 - w(0.34, 0.36))} />,
      <Tag key="lt" at={[650, 770]} text="NOT ON THE LINE" p={w(0.18, 0.22) * (1 - w(0.34, 0.36))} color={colors.red} />,
      <Tag key="et" at={[500, 470]} text="EDGE OF THE BOX" p={w(0.5, 0.54) * (1 - w(0.6, 0.62))} color={colors.green} />,
      <Tag key="sd" at={[290, 570]} text="SIDE OF THE GOAL" p={w(0.78, 0.82)} color={colors.green} />,
    );
  }

  return (
    <PitchMarkings>
      {overlays}
      <Figure at={keeper} team="keeper" label="GK" moving={keeperMoving} up />
      <Figure at={attacker} team="them" label="A" moving={attackerMoving} faceLeft={attackerMoving && attacker[0] < attackerAt(wPrev)[0]} up={attackerMoving && attacker[1] < attackerAt(wPrev)[1]} />
      <Figure at={D} team="us" label="5" />
      <Ball at={ball} />
      {above}
    </PitchMarkings>
  );
};

// ---- Scripted boards: a step's players, ball and drawings written as data in the episode file ----
// Times are fractions of the step (0 = start, 1 = end). Paths are [time, x, y] keyframes.

type Key = [number, number, number];
type Timed = { t?: [number, number]; until?: number };
const PALETTE: Record<string, string> = { green: colors.green, red: colors.red, yellow: colors.yellow, amber: colors.amber, white: '#fff', blue: colors.blue };

export type BoardSpec = {
  view?: View;
  // `faces` sets which way a player looks from a given time; keepers look up the pitch unless told otherwise.
  players?: Array<{ id: string; team: 'us' | 'them' | 'keeper'; label: string; path: Key[]; ghost?: boolean; faces?: Array<[number, 'up' | 'down']> }>;
  ball?: Key[];
  ballCurve?: { t: [number, number]; from: Pt; to: Pt; via: Pt };
  lines?: Array<Timed & { from: Pt; to: Pt; color: string; dashed?: boolean; curve?: Pt }>;
  bubbles?: Array<Timed & { at: string | Pt; text: string; color?: string; below?: boolean }>;
  tags?: Array<Timed & { at: Pt; text: string; color: string; size?: number }>;
  marks?: Array<Timed & { kind: 'cross' | 'tick'; at: Pt }>;
};

const along = (path: Key[], f: number): Pt => {
  if (path.length === 1 || f <= path[0][0]) return [path[0][1], path[0][2]];
  for (let i = 1; i < path.length; i++) {
    const [t1, x1, y1] = path[i];
    const [t0, x0, y0] = path[i - 1];
    if (f <= t1) {
      const p = ease(Math.min(1, Math.max(0, (f - t0) / Math.max(1e-6, t1 - t0))));
      return [x0 + (x1 - x0) * p, y0 + (y1 - y0) * p];
    }
  }
  const last = path[path.length - 1];
  return [last[1], last[2]];
};

// Fade in over the item's window, then out again at `until` (if given).
const shown = (w: ReturnType<typeof windowAt>, item: Timed) => {
  const [a, b] = item.t ?? [0, 0.001];
  const inP = w(a, b);
  return item.until !== undefined ? inP * (1 - w(item.until, item.until + 0.03)) : inP;
};

export const Board: React.FC<{ spec: BoardSpec; frame: number; total: number }> = ({ spec, frame, total }) => {
  const f = Math.min(1, Math.max(0, frame / total));
  const fPrev = Math.min(1, Math.max(0, (frame - 1) / total));
  const w = windowAt(frame, total);
  const players = spec.players ?? [];
  const pos: Record<string, Pt> = {};
  players.forEach((p) => (pos[p.id] = along(p.path, f)));

  let ball: Pt | null = spec.ball ? along(spec.ball, f) : null;
  if (spec.ballCurve) {
    const c = spec.ballCurve;
    const p = w(c.t[0], c.t[1]);
    if (p > 0) ball = quad(c.from, c.via, c.to, p);
  }

  return (
    <PitchMarkings view={spec.view}>
      {(spec.lines ?? []).map((l, i) => (
        <PassLine key={`l${i}`} a={l.from} b={l.to} p={w(...(l.t ?? [0, 0.001]))} opacity={l.until !== undefined ? 1 - w(l.until, l.until + 0.03) : 1} color={PALETTE[l.color] ?? l.color} dashed={l.dashed} curve={l.curve} />
      ))}
      {(spec.marks ?? []).map((m, i) =>
        m.kind === 'cross' ? <Cross key={`m${i}`} at={m.at} p={shown(w, m)} /> : <Tick key={`m${i}`} at={m.at} p={shown(w, m)} />,
      )}
      {players
        .slice()
        .sort((a, b) => pos[a.id][1] - pos[b.id][1])
        .map((p) => {
          const prev = along(p.path, fPrev);
          const now = pos[p.id];
          const isMoving = moving(now, prev);
          // A running player looks where they run; otherwise they keep their scripted facing.
          let facing: 'up' | 'down' = p.team === 'keeper' ? 'up' : 'down';
          for (const [t, dir] of p.faces ?? []) if (f >= t) facing = dir;
          const dx = now[0] - prev[0];
          const dy = now[1] - prev[1];
          if (isMoving && Math.abs(dy) > Math.abs(dx) * 0.4) facing = dy < 0 ? 'up' : 'down';
          return <Figure key={p.id} at={now} team={p.team} label={p.label} ghost={p.ghost} moving={isMoving} faceLeft={isMoving && dx < 0} up={facing === 'up'} />;
        })}
      {ball ? <Ball at={ball} /> : null}
      {(spec.tags ?? []).map((t, i) => (
        <Tag key={`t${i}`} at={t.at} text={t.text} p={shown(w, t)} color={PALETTE[t.color] ?? t.color} size={t.size} />
      ))}
      {(spec.bubbles ?? []).map((b, i) => (
        <Bubble key={`b${i}`} at={typeof b.at === 'string' ? pos[b.at] : b.at} text={b.text} p={shown(w, b)} color={b.color ? PALETTE[b.color] ?? b.color : '#fff'} below={b.below} />
      ))}
    </PitchMarkings>
  );
};
