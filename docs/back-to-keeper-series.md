# Back to the Keeper: episode plan

A six-episode series for U12 players on passing back to the goalkeeper and what happens next. It replaces the single 9-minute draft (`output/videos/goalkeeper-decisions-lesson.mp4`).

## Who it is for

U12 boys, sharp but 11 years old. Sentences of 12 words or fewer. One idea per episode. Every lesson ends with a cue word they can shout in a game.

## How every episode runs (about 4 minutes, always under 5)

These are teaching videos, not drill videos.

1. **See it.** One animated top-down pitch, using the Training Ground player figures. The players carry on from step to step, so the picture builds rather than restarting.
2. **Watch the pros.** A few real clips, replayed and slowed down as often as needed. Real play is preferred over more clips from different games.
3. **You choose.** The full picture freezes on the decision with one short question, and the narrator doesn't read out options. A five-second countdown, then the arrows are drawn in and the play continues.
4. **Break it down.** Freeze on the key moment, circle what matters and say why. Keeper lessons (positioning, coming out to make the goal smaller) are called out for the team's keepers.
5. **Remember.** The steps and the cue word, tied back to the rest of our game.

Standing rules for the content: the keeper's call wins (the defender can point, but the keeper has the best view), and "side, not middle" applies to building out and clearing too.

The site's Videos page shows each episode with a five-question check underneath, using the existing quiz engine and badges.

## Episodes

| # | Title | Teaches | Cue word | Clips (file, time) |
|---|---|---|---|---|
| 1 | When do we go back? | Go back when you face your own goal, are under pressure and have nothing forward. Don't go back when you can turn or play forward. | "Turn or return" | Steele 0:40 to 0:50 (good back-pass under pressure, bouncing ball) |
| 2 | The rule | A deliberate kick or throw-in back means no hands. Head, chest or knee is fine. If the keeper picks it up, the other team gets an indirect free kick. | "Feet, keeper!" | Animation only; no match clip needed |
| 3 | How to pass it back | Look first. Call "Keeper!". Pass to the side of the goal, never across it. Aim for the keeper's stronger foot, with enough pace. | "Side, not middle" | Kepa and Jorginho 0:00 to 0:21 (pass where the keeper is not); Iwasaki 0:00 to 0:12 (too short, attacker gets in) |
| 4 | Keeper: get ready before it arrives | Step off the line and out wide. Keep your body open. Look around while the ball travels. Talk. | "Wide and open" | Ortega 0:06 to 0:23 (stays wide, looks while the ball travels, moves wider early); Ortega 0:39 to 0:47 (opens wide to help the centre-back); Neuer 0:25 to 0:38 |
| 5 | Keeper: first touch and choice | First touch away from pressure, or one touch if the attacker is close. Fake one way, play the other. If in doubt, kick it out. | "Touch away" | Tapia 0:00 to 0:35 (touches create room); Ortega 0:27 to 0:36 (fakes to the centre-back, the middle opens); Ortega 0:48 to 1:08 (fakes a long kick, the centre-back becomes free) |
| 6 | After the pass: everyone helps | The passer moves to offer again. Options: the far side, the fullback dropping wide, centre-backs splitting apart, or long over the pressure. Don't pass to a team-mate with an opponent on their back. | "Pass and offer" | Steele 0:00 to 0:10 and 1:35 to 2:25 (passes into a trapped midfielder, goal; the free player was the defender who passed); South Africa 0:00 to 0:21 (receiver closed from behind); Nnadozie 0:00 to 0:36 (keeper passes, then offers again); Berger 0:10 to 0:25 (looks, then switches long over the pressure to the far side) |

Shape in episode 6 follows the team's 9 v 9 formation. Confirm with the coach which shape they use when building from the back.

## Source clips

All are saved in `output/videos/clips/` or `output/videos/sources/`.

- FIFA Training Centre: Neuer, Nnadozie, Tapia, Iwasaki, South Africa v Mexico, Berger (Germany v Australia). The Berger file is still in Downloads and needs moving into the project.
- Chelsea FC (YouTube): Kepa and Jorginho.
- Goalkeeping Solutions (YouTube): "Build Up Positioning & Passing Disguise – Stefan Ortega".
- Goalkeeper Analysis (YouTube): "Short passing under pressure" (Steele, West Brom v Leicester).

Both YouTube analysis videos have their own text and drawings burned into the picture. We crop or blur those areas, keep our own drawings, and credit each channel by name at the end of each episode.

**Gaps still to fill:** a clean pro example of a back-pass played to the side of the goal (episode 3), and a fullback dropping wide to take the keeper's pass (episode 6). Animation covers both until we find clips.

## Production tools

| Step | Tool | Why |
|---|---|---|
| Narration | ElevenLabs. Try "Loyal" (Canadian, conversational) and "Daniel" (steady broadcaster) on a 20-second sample before choosing | Natural voice; the draft's Windows voice is retired |
| Episode assembly, animated pitch, arrows, zoom, freeze-and-choose cards | Remotion (builds videos from web code; free for individuals) | Smooth motion and clean text; one tool for diagrams and clip treatment; every episode re-renders from the script when wording changes |
| Clip trimming and cropping | ffmpeg (installed) | Fast, exact |
| Following the keeper in a wide shot | Zoom positions set by hand per clip | Quicker and more reliable than automatic player tracking for about 15 clips |

## Building an episode

Each episode is a script file in `video/src/episodes/` (for example `ep3.json`): narration lines, clip times, freeze-frame circles and arrows, and quiz options. Changing the wording or a clip time and rendering again rebuilds the whole video.

From the `video` folder:

1. `.\tools\prepare.ps1 -Episode ep3` copies the clips, grabs the freeze frames and records the narration with the free Windows voice. Add `-Provider elevenlabs -Voice Daniel` to use ElevenLabs instead.
2. `npm run studio` opens a live preview for adjusting circles and timing.
3. `npm run render -- ep3 out/ep3.mp4` writes the finished video.

## Costs

- **ElevenLabs:** the free plan has 3,139 characters left until 25 October 2026, enough for one episode. The full series is about 11,000 characters, roughly 15,000 to 20,000 with re-takes. The Starter plan (check the current price, about US$5 a month, 30,000 characters) covers it in one month and can be cancelled after.
- **Remotion:** free. Each episode takes a few minutes to render on this PC.
- **Storage:** six episodes at roughly 25 MB each, about 150 MB, on Google Drive as now.

## Hosting

No change for now: the site stays on GitHub Pages and the videos stay on Google Drive, shared with the team. One limit: a Google Drive player can't be paused or controlled by the page, so the questions sit under each video instead of popping up mid-video. The freeze-and-choose cards are built into the video itself, so the lesson still works.
