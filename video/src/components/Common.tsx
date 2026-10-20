import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { body, colors, display, PAD } from '../theme';
import { Narration, sec } from '../timeline';

export const Voice: React.FC<{ n: Narration; k: string }> = ({ n, k }) => {
  const line = n[k];
  if (!line) return null;
  return (
    <Sequence from={sec(PAD.before)} layout="none">
      <Audio src={staticFile(line.file)} />
    </Sequence>
  );
};

export const Backdrop: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(1200px 700px at 80% 20%, #16325a 0%, ${colors.bg} 60%)`,
      fontFamily: body,
      color: colors.ink,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
    {children}
    <TeamMark />
  </AbsoluteFill>
);

export const Bolt: React.FC<{ size: number; color?: string }> = ({ size, color = colors.amber }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M13.5 1 L4 13.5 h6.5 L8.5 23 L20 9.5 h-6.8 z" fill={color} stroke="#0b1324" strokeWidth="0.8" strokeLinejoin="round" />
  </svg>
);

// Small team mark in the top-right corner of every card scene.
export const TeamMark: React.FC = () => (
  <div style={{ position: 'absolute', right: 40, top: 30, display: 'flex', alignItems: 'center', gap: 10, opacity: 0.85 }}>
    <Bolt size={34} />
    <div style={{ fontFamily: display, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: '#cbd5e1' }}>BLUE THUNDER</div>
  </div>
);

// Fades and lifts an element in, starting at `at` frames.
export const useRise = (at = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 200 } });
  return { opacity: p, transform: `translateY(${(1 - p) * 30}px)` };
};

export const Kicker: React.FC<{ children: React.ReactNode; color?: string; at?: number }> = ({ children, color = colors.accent, at = 0 }) => {
  const style = useRise(at);
  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 56, height: 6, background: color, borderRadius: 3 }} />
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 34, letterSpacing: 6, color, textTransform: 'uppercase' }}>{children}</div>
    </div>
  );
};

export const Heading: React.FC<{ children: React.ReactNode; size?: number; at?: number }> = ({ children, size = 104, at = 4 }) => {
  const style = useRise(at);
  return (
    <div style={{ ...style, fontFamily: display, fontWeight: 700, fontSize: size, lineHeight: 0.95, textTransform: 'uppercase', fontStyle: 'italic' }}>
      {children}
    </div>
  );
};

export const Sub: React.FC<{ children: React.ReactNode; at?: number }> = ({ children, at = 10 }) => {
  const style = useRise(at);
  return <div style={{ ...style, fontSize: 40, lineHeight: 1.3, color: '#cbd5e1', fontWeight: 600 }}>{children}</div>;
};

export const CueChip: React.FC<{ cue: string; at?: number }> = ({ cue, at = 0 }) => {
  const style = useRise(at);
  return (
    <div style={{ ...style, display: 'inline-flex', alignItems: 'center', gap: 18, background: colors.amber, color: '#111827', padding: '14px 28px', borderRadius: 14 }}>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 28, letterSpacing: 4 }}>CUE WORD</span>
      <span style={{ fontFamily: display, fontWeight: 700, fontSize: 44, fontStyle: 'italic' }}>"{cue}"</span>
    </div>
  );
};

export const Footer: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 120, bottom: 50, fontFamily: display, fontSize: 26, letterSpacing: 4, color: colors.muted, textTransform: 'uppercase' }}>
    {text}
  </div>
);

export const fadeInOut = (frame: number, total: number, edge = 8) =>
  interpolate(frame, [0, edge, total - edge, total], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
