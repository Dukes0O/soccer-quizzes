import { FPS, PAD } from './theme';

export type Narration = Record<string, { file: string; seconds: number; words?: [string, number][] }>;

// Seconds into a line when a phrase is first spoken (from the voice's word timings), or null.
export const cueTime = (words: [string, number][] | undefined, cue: string): number | null => {
  if (!words) return null;
  const want = cue.toLowerCase().split(/[^a-z0-9']+/).filter(Boolean);
  for (let i = 0; i + want.length <= words.length; i++) {
    if (want.every((w, j) => words[i + j][0] === w)) return words[i][1];
  }
  return null;
};

export type Annotation = {
  kind: 'ring' | 'arrow' | 'cone' | 'label';
  text?: string;
  x?: number;
  y?: number;
  r?: number;
  from?: [number, number];
  to?: [number, number];
  points?: [number, number][];
  color: string;
  label?: string;
  labelSide?: 'up' | 'down';
  dashed?: boolean;
  delay?: number;
  cue?: string;
};

export type Beat = {
  t: 'play' | 'freeze';
  from?: number;
  to?: number;
  rate?: number;
  volume?: number;
  at?: number;
  vo?: string;
  question?: string;
  countdown?: number;
  caption?: string;
  captionTop?: boolean | number;
  questionSide?: 'right' | 'left';
  questionTop?: number;
  lowerThird?: string;
  masks?: number[][];
  annotations?: Annotation[];
};

export type Scene = {
  type: 'title' | 'steps' | 'clip' | 'recap' | 'credits';
  id: string;
  [key: string]: any;
};

export type Episode = {
  id: string;
  series: string;
  number: number;
  title: string;
  cue: string;
  scenes: Scene[];
};

export const sec = (s: number) => Math.round(s * FPS);

export const voFrames = (n: Narration, key: string) => {
  const line = n[key];
  if (!line) throw new Error(`Missing narration for ${key}; run tools/prepare.ps1`);
  return sec(PAD.before + line.seconds + PAD.after);
};

// A freeze lasts as long as its narration (at least 2 seconds), plus any countdown.
export const beatFrames = (scene: Scene, i: number, n: Narration) => {
  const b: Beat = scene.beats[i];
  if (b.t === 'play') return sec((b.to! - b.from!) / (b.rate ?? 1));
  const talk = b.vo ? voFrames(n, `${scene.id}.${i}`) : sec(2);
  return Math.max(sec(2), talk) + sec(b.countdown ?? 0);
};

export const stepFrames = (scene: Scene, i: number, n: Narration) => voFrames(n, `${scene.id}.${i}`) + sec(scene.steps[i].countdown ?? 0);

export const sceneFrames = (scene: Scene, n: Narration) => {
  if (scene.type === 'clip') return scene.beats.reduce((t: number, _: Beat, i: number) => t + beatFrames(scene, i, n), 0);
  if (scene.type === 'steps') return scene.steps.reduce((t: number, _: unknown, i: number) => t + stepFrames(scene, i, n), 0);
  const minimum = scene.type === 'credits' ? sec(5) : sec(4);
  return Math.max(minimum, voFrames(n, `${scene.id}.vo`));
};

export const episodeFrames = (ep: Episode, n: Narration) =>
  ep.scenes.reduce((total, s) => total + sceneFrames(s, n), 0);
