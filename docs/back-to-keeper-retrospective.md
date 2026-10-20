# Back to the Keeper: retrospective

What it took to get three teaching videos right, so the next series takes days, not weeks. Every item below was a correction Kyle had to make by watching a render. The point of this file (and the `soccer-film-room` skill built from it) is that none of them needs saying twice.

## What went wrong, grouped

### 1. Real play: too little, cut too short, mostly mistakes
- The first draft was nine minutes of mostly wide, unmarked broadcast footage, read by a robotic voice.
- Clips stopped before the play finished: Ortega before he received the ball; Leno with no view of the field or where the ball went; Navas before Bono actually picked it up.
- Episode 1 first showed only a mistake (Steele). Kyle: "show the boys how to do things correctly, not only what not to do."
- Fewer games, replayed and broken down, beats many games shown once.

**Rule:** every teaching point gets one complete, successful play from start to finish (pass, receive, next action, outcome), shown first. Mistakes come second. Replay and slow down the same clip rather than adding more clips.

### 2. Freezes and questions
- Questions gave the answer away (paused after the attacker already had the ball; the scoreboard showed the goal).
- The narrator read out every A, B, C option. Kids can read.
- Big question cards covered the play the question was about.
- "What should he do?" was asked before the options were shown.
- Highlight circles missed their players or sat on top of them.

**Rule:** options first, then the question, then the reveal. Freeze a moment earlier than feels necessary. Slim question strip in empty grass. Highlights painted on the grass under the player. Render every freeze and look before the full render.

### 3. Football content
- A keeper calls "Keeper!" (or their name, or "Keeper's ball"), never "Mine!".
- The keeper's call wins; the defender can point, but the keeper sees more.
- Keepers must move: off the line, edge of the box, side of the net. Coming out makes the goal smaller.
- A clearance arrow straight into an opponent is wrong; show it red, and the good one going wide.
- "Side, not middle" applies to building out and clearing too.
- Made-up phrases like "Feet, keeper!" sound wrong; use normal grammar.
- Rule details checked against IFAB Laws of the Game (indirect free kick from where the keeper handled it, moved to the goal-area line if inside the goal area; defenders may stand on their goal line between the posts; the trick earns a caution).
- Teaching videos, not drill videos: no training-game sections.

### 4. Diagrams
- Plain dots looked cheap; the Training Ground player figures work.
- Players faced the wrong way; a back-view sheet now exists (Training Ground assets, `miniature-players-back.webp`).
- Labels collided with player tags and the frame edge.

### 5. Voice
- Windows voice: unusable beyond drafts.
- ElevenLabs first takes ran straight through commas and full stops.
- Sentence-by-sentence recording sounded choppy; slowing the voice made it worse.
- What worked: Multilingual v2, whole line in one take, break tags after punctuation, style 0, similarity 0.95 or higher, speed 1.06. Some American drift remains; next time use similarity 0.97.
- On-screen labels must appear as their word is spoken (word timings from ElevenLabs), not at fixed seconds.

### 6. Research and checking
- A research helper reported Bono "has the ball in both hands at 6.4 seconds"; he did not. A helper reported Ederson "clears long"; he passed short.
- Header-backs caught by keepers took three search rounds; the answer was official full-match uploads and broadcast replays.

**Rule:** I check every claimed moment frame by frame myself before it goes into a script. Research happens before any rendering, against a list of what each episode needs.

### 7. Process and cost
- Gigabytes of render temp files and downloads piled up; clean up after every render.
- Files over 30 MB do not reach Kyle's phone; say so when sending.
- Ask for a short voice sample before re-recording everything.

## What the next series should take

1. Teaching plan with Kyle: the points, in order, and the success and mistake each needs (one conversation).
2. Footage research against that list, verified frame by frame, written up with exact seconds (one pass, before any scripting).
3. Scripts written to the standards in the skill; Kyle reads the script before any audio.
4. Check frames for every freeze, then one full render per episode.
5. Voice sample (30 seconds), then full voice, then final render with loudness matched.
6. Upload and post.

Target: two review rounds per episode, not eight.
