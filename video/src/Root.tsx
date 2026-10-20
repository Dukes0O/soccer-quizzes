import React from 'react';
import { Composition } from 'remotion';
import { EpisodeVideo } from './Episode';
import { FPS, H, W } from './theme';
import { Episode, Narration, episodeFrames } from './timeline';
import ep1 from './episodes/ep1.json';
import ep1Narration from './episodes/ep1.narration.json';
import ep2 from './episodes/ep2.json';
import ep2Narration from './episodes/ep2.narration.json';
import ep3 from './episodes/ep3.json';
import ep3Narration from './episodes/ep3.narration.json';

const episodes: Array<{ ep: Episode; n: Narration }> = [
  { ep: ep1 as Episode, n: ep1Narration as Narration },
  { ep: ep2 as Episode, n: ep2Narration as Narration },
  { ep: ep3 as Episode, n: ep3Narration as Narration },
];

export const Root: React.FC = () => (
  <>
    {episodes.map(({ ep, n }) => (
      <Composition
        key={ep.id}
        id={ep.id}
        component={EpisodeVideo as any}
        durationInFrames={episodeFrames(ep, n)}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={{ ep, n }}
      />
    ))}
  </>
);
