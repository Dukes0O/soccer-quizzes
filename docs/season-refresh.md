# Season refresh: September 2026

## Seasons

- `stats.html` is the new, empty 2026/27 season. The label follows the September start; change `data/current-season.json` if the team uses a different season name.
- `stats-spring-2026.html` is the preserved Spring 2026 page. Its data matches commit `6c6da3f` exactly. It includes all ten recorded fixtures, eight defensive lineups, clean-sheet credits, player totals, and the 130-minute streak story.
- The June 10 Boys vs. Parents friendly remains visible but excluded from competitive totals. Nine counted matches produced five wins, one loss, three ties, 46 goals for, 17 against, and three clean sheets.
- Do not edit the archive when adding current results. Add completed matches to `data/current-season.json` using `date`, `opponent`, `for`, and `against`. Set `countsForTeamStats: false` for a friendly that should not affect totals. Do not enter upcoming fixtures as 0-0 results.
- No previous player totals or roster assumptions have been carried into the new season.

## Learning levels

The nine topic banks contain 225 questions in total. Each topic has five Novice questions, ten Beginner questions, five Intermediate questions, and five Advanced questions.

- Novice: basic field, ball, and teammate concepts.
- Beginner: simple decisions in a clear situation.
- Intermediate: read pressure, space, timing, and the next action.
- Advanced: connect concepts and compare tactical choices. These are optional challenges, not a judgment of playing ability.

Each level offers a ten-question all-round challenge drawn across the nine topics. Topic practice uses up to ten questions, so shorter banks are clearly shown as five-question sessions. Questions and answers are both shuffled. No level is locked.

Each answer includes an explanation, including correct answers. Players advance when ready, can review all answers at the end, and can practise only missed questions. Missed-question practice does not overwrite a scored attempt or award a topic badge.

Topic badges require a perfect session at that level. A badge and best score survive a lower later attempt. Original unlevelled badges remain visible as Original challenge awards. Level records use `topic:level` keys; they do not replace old records. All-round challenges track scores but do not reuse an unrelated topic badge.

Progress remains in the existing `soccerQuizUser` browser storage key. No account, player-name entry, or network score submission is required. Moving to a different domain or browser does not move saved progress automatically. Blocked or damaged storage no longer stops a quiz; saving limitations are shown, and damaged data is not silently overwritten.

## Content review

Reviewed all 180 existing questions and added 45 Advanced questions. Revised over-general advice about wide build-up, passing weight, defensive pressure, goalkeeper choices, and shooting. Updated throw-in foot placement, indirect-kick movement, penalty rebounds, and goalkeeper handling. Tactical advice is framed around the situation rather than a universal best move.

Rondos are presented as possession under pressure with variable numbers, roles, and spaces. They are not limited to a 4v1 square. Inverted wingers and inverted full-backs are distinguished. Other stretch topics include third-player combinations, pressing cues, cover shadows, and positioning against a counter-attack.

Rules questions refer to the standard Laws where relevant. The coach should confirm local youth rules on field size, offside, retreat lines, restarts, and goalkeeper handling. The site does not assume the team's age group or league rules for the new season.

### Coaching and rules sources

Reviewed September 7, 2026. Questions are original teaching scenarios, not copied exercises.

- [FIFA: Dynamic rondos and numerical advantages](https://www.fifatrainingcentre.com/en/practice/grassroots/12-to-15/dynamicrondos-and-numerical-advantages.php)
- [FIFA: Two-zone transitional rondo](https://www.fifatrainingcentre.com/en/practice/talent-coach-programme/build-and-progress/2-zone-transitional-rondo-prioritising-vertical-play.php)
- [FIFA: Futsal coaching manual, winger terminology](https://www.fifatrainingcentre.com/media/native/community-area-document/resources/futsal/FIFA_GFD_Futsal_Coaching_Manual_EN.pdf)
- [FIFA: Inverted full-backs in attacking phases](https://www.fifatrainingcentre.com/en/game/tournaments/fcwc/2025/team-analyses/assessing-the-influence-of-inverted-full-backs-in-attacking-phase.php)
- [IFAB: Offside](https://www.theifab.com/laws/latest/offside/)
- [IFAB: Fouls and misconduct, including keeper handling](https://www.theifab.com/laws/latest/fouls-and-misconduct/)
- [IFAB: Free kicks](https://www.theifab.com/laws/latest/free-kicks/)
- [IFAB: Penalty kicks](https://www.theifab.com/laws/latest/the-penalty-kick/)
- [IFAB: Throw-ins](https://www.theifab.com/laws/latest/the-throw-in/)

## Hosting recommendation

Keep GitHub Pages for now. The new quiz levels, archive, and inline Drive previews work on the existing static site. A move to Netlify is not needed just to play videos inside the page.

Netlify is worth considering when the team needs deploy previews, forms, or server-side features. Its current Free plan has 300 monthly credits; web bandwidth costs 20 credits per GB and production deploys cost 15 credits each. As a simple upper bound, 300 credits would cover 15 GB of bandwidth if no credits were used elsewhere. Real available bandwidth is lower once other usage is counted. Legacy plans may differ. [Netlify pricing](https://www.netlify.com/pricing/), [credit rules](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/).

GitHub Pages currently has a 1 GB published-site limit and a soft 100 GB monthly bandwidth limit. These limits also make it a poor place to accumulate a large match-video library. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

For videos, treat web hosting and video delivery as separate decisions. Keep the existing Drive files and their sharing settings for now. The page opens a Drive preview on demand and retains an Open in Google Drive fallback. An embed does not bypass Drive sign-in, sharing permissions, or playback limits. No files have been moved or made public.

If video playback becomes a problem, evaluate a dedicated video service with adaptive streaming, access controls, and a budget based on expected viewing. Do not assume that a Netlify page provides private team access or video conversion by itself. For clips showing children, confirm the team's sharing consent and access policy before changing the audience. This is a product safeguard, not legal advice.

## Verification

Run `node --test tests/site.test.cjs` for bank validation, answer randomization, mixed-topic coverage, legacy badges, unavailable storage, empty-season behavior, exact archive preservation, and case-sensitive asset references.

For a local preview, run `python -m http.server 8765 --bind 127.0.0.1` in the project folder and open `http://127.0.0.1:8765/`. JSON loading requires HTTP rather than opening the HTML file directly.

The old remote branch `ui-overhaul-ea-fc-style-2417646825804763861` was verified against a refreshed `origin/main`: 14 commits behind and zero commits unique to that branch. It was then deleted from the remote.

Browser checks covered desktop (1440 x 900) and mobile (390 x 844) layouts, the empty season, all ten archived fixtures, level switching, a perfect five-question badge, a ten-question mixed challenge, and missed-question practice without score replacement. The existing Drive video played inside the dialog; closing it removed the iframe and stopped playback. Home-page visited-link contrast and the playbook's misleading colour legend were also corrected.
