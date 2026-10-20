import { loadFont as loadRajdhani } from '@remotion/google-fonts/Rajdhani';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

export const display = loadRajdhani('normal', { weights: ['600', '700'], subsets: ['latin'] }).fontFamily;
export const body = loadInter('normal', { weights: ['400', '600', '800'], subsets: ['latin'] }).fontFamily;

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export const colors = {
  bg: '#0b1324',
  panel: '#13203a',
  ink: '#f8fafc',
  muted: '#94a3b8',
  accent: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#facc15',
  pitch: '#1f7a3a',
  pitchDark: '#1a6b33',
  line: 'rgba(255,255,255,0.85)',
};

export const annotationColor: Record<string, string> = {
  red: colors.red,
  blue: '#60a5fa',
  green: colors.green,
  yellow: colors.yellow,
  white: '#ffffff',
};

// Gaps around narration, in seconds.
export const PAD = { before: 0.4, after: 0.8 };
export const COUNTDOWN_SECONDS = 5;
