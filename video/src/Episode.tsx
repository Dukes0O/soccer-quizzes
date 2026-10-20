import React from 'react';
import { AbsoluteFill, Series, useCurrentFrame, useVideoConfig } from 'remotion';
import { CreditsCard, RecapCard, StepsScene, TitleCard } from './components/Cards';
import { ClipScene } from './components/Clip';
import { colors } from './theme';
import { Episode as EpisodeSpec, Narration, sceneFrames } from './timeline';

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, height: 6, width: `${(frame / durationInFrames) * 100}%`, background: colors.accent, opacity: 0.8 }} />
  );
};

export const EpisodeVideo: React.FC<{ ep: EpisodeSpec; n: Narration }> = ({ ep, n }) => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <Series>
      {ep.scenes.map((scene) => {
        const total = sceneFrames(scene, n);
        return (
          <Series.Sequence key={scene.id} durationInFrames={total} name={scene.id}>
            {scene.type === 'title' && <TitleCard ep={ep} scene={scene} n={n} />}
            {scene.type === 'steps' && <StepsScene scene={scene} n={n} />}
            {scene.type === 'clip' && <ClipScene epId={ep.id} scene={scene} n={n} />}
            {scene.type === 'recap' && <RecapCard ep={ep} scene={scene} n={n} total={total} />}
            {scene.type === 'credits' && <CreditsCard ep={ep} scene={scene} n={n} />}
          </Series.Sequence>
        );
      })}
    </Series>
    <Progress />
  </AbsoluteFill>
);
