# Soccer Quizzes Platform

A scalable, static, and modular quiz platform designed for GitHub Pages. Built with software engineering best practices for maintainability, extensibility, and ease of collaboration.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Playbook / Graphics Gallery](#playbook--graphics-gallery)
- [Video Clips Page](#video-clips-page)
- [Recent Enhancements](#recent-enhancements)
- [How to Add a New Quiz](#how-to-add-a-new-quiz)
- [Quiz Bank & Randomization](#quiz-bank--randomization)
- [User Progress & Badges](#user-progress--badges)
- [Customization & Extensibility](#customization--extensibility)
- [Development Workflow](#development-workflow)
- [Project Status & Roadmap](#project-status--roadmap)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

This project is a client-side quiz platform for soccer (football) knowledge, designed to run entirely on GitHub Pages. It supports multiple quizzes, custom graphics, badges, and persistent user progress using browser localStorage. The platform is highly modular and easy to extend.

---

## Project Structure

```
soccer-quizzes/
  index.html                  # Main hub page (links to Quizzes, Playbook, and Video Clips)
  video-clips.html            # Page for curated soccer video clips
  /quizzes/
    index.html                # Quiz selection page
    quiz.html                 # Generic quiz template (loads quiz data dynamically)
    defense.json              # Defense quiz bank (15+ questions)
    passing-movement.json     # Passing & Movement quiz bank (15+ questions)
    shooting-finishing.json   # Shooting & Finishing quiz bank (15+ questions)
    soccer-field-awareness.json # Soccer Field Awareness quiz bank (15+ questions)
    attacking-with-purpose.json # Attacking with Purpose quiz bank (15+ questions)
    transitions.json          # Transitions (Attack ↔ Defense) quiz bank (15+ questions)
    build-from-back.json      # Build from the Back quiz bank (15+ questions)
    manifest.json             # List of all available quizzes (metadata)
  /assets/
    /graphics/
      defense.svg             # (Placeholder: ⚽️)
      passing.svg             # (Placeholder: 🔄)
      shooting.svg            # (Placeholder: 🎯)
      soccer-field-awareness.svg # (Placeholder: 🗺️)
      attacking-with-purpose.svg # (Placeholder: 🔥)
      transitions.svg         # (Placeholder: 🔄)
      build-from-back.svg     # (Placeholder: 🏗️)
      ...                     # More graphics per quiz
    /badges/
      defense.png
      passing-movement.png
      shooting-finishing.png
      soccer-field-awareness.png
      attacking-with-purpose.png
      transitions.png
      build-from-back.png
      ...                     # More badges per quiz
    /animations/
      defense.json            # Animation data (or placeholder)
      passing.json            # Animation data (or placeholder)
      shooting.json           # Animation data (or placeholder)
      soccer-field-awareness.json # Animation data (or placeholder)
      attacking-with-purpose.json # Animation data (or placeholder)
      transitions.json        # Animation data (or placeholder)
      build-from-back.json    # Animation data (or placeholder)
      ...                     # More animation assets
    badge-style.json         # Badge style definition (JSON, design spec)
  /js/
    quiz.js                   # Quiz logic (for quiz.html)
    landing.js                # Landing page logic
    user.js                   # User memory, badges, progress logic
  style.css                   # Common styles
  README.md                   # Project documentation
```

---

## Playbook / Graphics Gallery

This project supports a static image gallery for soccer formation diagrams, field graphics, and other reference images, accessible via the main hub page. This is designed for U11 boys to easily browse and learn from visual resources.

### Information Architecture
- `/index.html` is the single top-level entry point, now a hub page with three main sections:
  - **Quizzes** → `/quizzes/index.html` (the original landing content, now moved)
  - **Playbook** (Formations & Graphics) → `/resources/index.html` (new gallery landing page)
  - **Video Clips** → `/video-clips.html` (new page for curated video links)
- Navigation between hub, quizzes, playbook, and video clips is intuitive for kids.

### Directory Layout
```
soccer-quizzes/
  /resources/              # NEW section
    index.html             # Gallery landing
    formation.html         # (optional) Single formation detail page
    manifest.json          # Metadata for all graphics
  /assets/graphics/        # PNGs or SVGs (e.g., crossing from right.png, field zones thirds.png)
  /js/gallery.js           # Logic to load manifest and render gallery
```

### Gallery Manifest Example
`resources/manifest.json`:
```json
[
  {
    "id": "crossing-from-right",
    "title": "Crossing from Right",
    "description": "Technique for delivering balls from the right flank",
    "image": "assets/graphics/crossing from right.png",
    "themeColor": "#10b981"
  }
]
```

### How the Gallery Works
- `gallery.js` fetches `resources/manifest.json` and renders cards for each formation/graphic.
- Each card: thumbnail, title, description, and a “View Full” button.
- (Optional) Clicking a card opens `formation.html?id=crossing-from-right` for a full-size image and teaching notes.

### Static Image Handling
- Use **PNG** for complex diagrams/screenshots; use **optimized SVG** for line-art for crisp scaling.
- Place all images in `/assets/graphics/`.
- Add `loading="lazy"` to `<img>` tags for performance.
- Use Tailwind utility `max-w-full h-auto` for responsive images.

### Updating & Extending the Gallery
- To add new graphics:
  1. Place PNG/SVG in `/assets/graphics/`.
  2. Add an entry to `resources/manifest.json` (see example above).
  3. (Optional) Add detail notes as Markdown and link via manifest.
- To add animation: drop Lottie JSON in `/assets/animations/` and reference in the manifest.

### Contribution Workflow
- Add new graphics and manifest entries in a single commit.
- Recommended commit message template:
  ```
  feat(resources): add crossing from right, field zones thirds diagrams + manifest entries
  ```
- PR review/self-review before merging. Confirm GitHub Pages redeploys and share the new URL with the team.

### Future-Proofing
- Track “viewed” formations in `localStorage` (like quiz badges) for unlockable content.
- Support Lottie animations for interactive graphics.
- Extend manifest with Markdown docs for coach/teaching notes.

---

## Video Clips Page

A new `video-clips.html` page has been added to host links to soccer video clips. These clips are intended to be short, focused, and provide visual examples of tactics, skills, or game situations.

- **Content**: Links to videos hosted on Google Drive.
- **Layout**: Videos are displayed in a responsive grid format with thumbnails and titles.
- **Disclaimer**: Includes a note about copyright, as direct embedding of YouTube videos can be problematic.
- **Navigation**: Accessible from the main hub (`index.html`) and navigation bars on other key pages.

---

## Recent Enhancements

- **Video Clips Page**: Added `video-clips.html` to display links to Google Drive videos with thumbnails and titles. This section is linked from the homepage and navigation bars.
- **Homepage Update**: The main `index.html` page was enhanced with responsive side images of Lionel Messi and Cristiano Ronaldo, flanking the main content cards. These images adjust with screen size and are hidden on smaller mobile devices.
- **New Quiz Added**: A new quiz, "Build from the Back," was added to the `quizzes/` directory (`build-from-back.json`) and included in the `quizzes/manifest.json`.
- **Navigation Updates**: Navigation bars on `index.html`, `quizzes/index.html`, and `resources/index.html` were updated to include a link to the new Video Clips page.
- **Styling Consistency**: Ensured consistent styling for navigation ribbons and interactive cards across different sections of the site.
- **Badge Asset Consistency**:
  - All quizzes now use PNG badge assets (`/assets/badges/{quiz}.png`), referenced in both quiz JSON and manifest.
  - Badge display logic updated to render PNGs as images (not text paths or emoji).
  - Quiz cards show large badges; "Your Badges" section shows smaller, downloadable badges.
- **Downloadable Badges**:
  - Users can download earned badges from the "Your Badges" section by clicking on them.
- **Robust Local & GitHub Pages Compatibility**:
  - All fetch paths for quizzes and manifest are relative and robust to both local and GitHub Pages deployments.
  - Enhanced error reporting for missing quizzes or manifest fetch issues.
- **UI/UX Improvements**:
  - Improved badge sizing and layout for clarity and visual appeal.
  - Quiz badge beside each quiz card is larger for prominence, and displays the user's personal best until the badge is earned.
- **Personal Best Tracking**:
  - Each quiz card now displays your highest score achieved ("Personal Best") until you earn the badge (10/10), at which point the badge is shown instead.
- **Cleanup**:
  - Removed obsolete or unused files (e.g., `wordpress-embed.html`).
- **Badge Style Spec**:
  - The badge design system is now documented in `/assets/badge-style.json` for future reference or automated badge generation.

---

## How to Add a New Quiz

1. **Create Quiz Data:**
   - Add a new JSON file in `/quizzes/` (e.g., `midfield.json`) with at least 15 questions.
   - Use the structure below:
     ```json
     {
       "id": "midfield",
       "title": "Midfield Mastery Quiz",
       "description": "Test your midfield soccer knowledge!",
       "graphic": "🧠",
       "badge": "🎖️",
       "animation": "assets/animations/midfield.json",
       "themeColor": "#2563eb",
       "questions": [
         { "question": "Sample?", "options": ["A", "B"], "correct": 0, "explanation": "Sample." }
         // ...at least 14 more
       ]
     }
     ```
2. **Update Manifest:**
   - Add an entry for the new quiz in `/quizzes/manifest.json`.
3. **Add Graphics/Badges/Animations:**
   - Use emojis as placeholders or add SVG/JSON assets to `/assets/graphics/`, `/assets/badges/`, and `/assets/animations/`.
4. **No code changes required!** The platform will automatically recognize new quizzes.

---

## Quiz Bank & Randomization
- Six quiz banks are provided as examples:
  - **Defense** (updated April 2025)
  - **Passing & Movement** (updated April 2025)
  - **Shooting & Finishing** (updated April 2025)
  - **Soccer Field Awareness**
  - **Attacking with Purpose**
  - **Transitions (Attack ↔ Defense)**
  - **Build from the Back**
- Each quiz bank is a JSON file in `/quizzes/`, containing at least 15 questions. Each quiz attempt randomly selects 10 questions (no repeats per session).

### Example Quiz Bank Structure

```json
{
  "id": "field-awareness",
  "title": "Soccer Field Awareness",
  "description": "Know your field! Boundaries, positions, and smart movement.",
  "graphic": "🗺️",
  "badge": "📍",
  "animation": "assets/animations/field-awareness.json",
  "themeColor": "#0284c7",
  "questions": [
    { "question": "What’s the name of the big box in front of your goal?", "options": ["The fun zone", "The 18-yard box (penalty area)", "The midfield", "The restart zone"], "correct": 1, "explanation": "The 18-yard box is where the goalie can use hands and where penalties happen." },
    ...
  ]
}
```

---

## Adding New Quizzes

1. Create a new JSON file in `/quizzes/` following the structure above. You can use any of the provided quiz banks as a template.
2. Add the quiz metadata to `quizzes/manifest.json` (id, title, description, graphic, badge, animation, themeColor).
3. Add any new assets (graphics, badges, animations) to the appropriate folders in `/assets/`.
4. No code changes are required—new quizzes will appear automatically on the landing page!

---

## User Progress & Badges
- User progress (scores, badges, completed quizzes) is stored in the browser's `localStorage`.
- Badges are awarded for completing quizzes (emoji/SVG shown on the landing page).
- Users can reset their progress from the landing page.

---

## Customization & Extensibility
- **Graphics:** Each quiz can specify a unique graphic (emoji or SVG).
- **Badges:** Each quiz can specify a unique badge (emoji or SVG/PNG). Badge graphics have been added to `/assets/badges/`.
- **Animations:** Each quiz can specify a unique animation asset (JSON, Lottie, or placeholder).
- **Themes:** Each quiz can have its own color theme.
- **Question Banks:** Each quiz loads its own question set from its JSON file.
- **Future:** Easily add authentication, or shareable badges; the codebase is modular for future enhancements.

---

## Development Workflow (Best Practices)
- **Version Control:**
  - Use regular, descriptive git commits (e.g., `git commit -m "Add passing & movement quiz bank"`).
  - Branch for features/bugfixes, merge via pull requests.
- **Code Organization:**
  - Keep quiz logic, user logic, and UI logic separated in `/js/`.
  - Use placeholder assets (emojis) for graphics, badges, and animations until SVGs/JSONs are available.
- **Testing:**
  - Test new quizzes and features locally before pushing.
- **Static-Only:**
  - All code and assets must be static and client-side (works on GitHub Pages).

---

## Project Status & Roadmap

✅ Completed: Hub, quizzes, gallery, formation detail, navigation ribbon, progress & badge logic, responsive quiz progress tracker with PNG assets (SVG removed), responsive styling, and robust relative fetch paths.

🎯 Next Milestones:
- Cross-environment testing (localhost & GitHub Pages)
- Cache busting for JS/CSS
- Expand gallery & quizzes
- Add Lottie animations & Markdown coach notes
- Update documentation and add troubleshooting guide

---

## Future Enhancements
- SVG/PNG graphics and badges (replace emojis as assets become available)
- User authentication (optional, for cloud sync)
- Shareable/downloadable badges
- Dark/light mode theming
- Enhanced accessibility
- More advanced animations (per quiz or per question)

---

## Placeholders
- Emojis are used as placeholders for graphics, badges, and animations.
- Placeholder text or comments are included where future features/assets will be integrated.

---

## Questions?
For any questions or contributions, open an issue or pull request on the repository.
