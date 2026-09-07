# Soccer Academy Pro Hub

## 2026/27 season

The new season starts empty. The complete Spring 2026 stats page remains available from the Stats page. Quizzes now have four learning levels, 225 teaching questions, answer explanations, and missed-question practice. Existing badges are preserved.

See [season refresh and hosting notes](docs/season-refresh.md) for content sources, season maintenance, progress storage, and the GitHub Pages / Netlify recommendation. Run `node --test tests/site.test.cjs` to check the data and core behavior.

A professional-grade, high-energy soccer hub designed for U11 players and their parents. This platform combines tactical learning, gamified quizzes, and video analysis into a sleek, "EA FC" inspired dashboard.

---

## 🎨 Aesthetic: Pro Dashboard
The platform has been overhauled with a **"Pro Dashboard"** aesthetic:
- **Dark Mode:** Deep Navy and Carbon backgrounds for a high-end feel.
- **Glassmorphism:** Modern UI panels with blurred backgrounds and neon accents.
- **Typography:** Using **Rajdhani** and **Inter** for a bold, sports-broadcast look.
- **Gamification:** EA FC-style player cards and match simulation progress.

---

## 🚀 Recent Major Overhaul (May 2025)
- **Global Theme:** Implemented the "Pro Hub" dark-mode aesthetic across all pages.
- **Match Simulation Quizzes:** Redesigned the quiz UI to include a "Match Day" field progress tracker, "GOAL!!!" confetti animations, and haptic-style feedback (screen-shake).
- **Tactical Whiteboard:** The Playbook and Formations sections now resemble a digital coach's tablet with tactical grids and "Academy Intel" styling.
- **Video Hub:** Upgraded `video-clips.html` with a "Featured Analysis" hero section and professional grid layout.
- **Mobile Responsive:** All new features are fully responsive, ensuring a great experience on tablets and smartphones.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Playbook / Graphics Gallery](#playbook--graphics-gallery)
- [Video Clips Page](#video-clips-page)
- [How to Add a New Quiz](#how-to-add-a-new-quiz)
- [Development Workflow](#development-workflow)
- [Roadmap & Future Enhancements](#roadmap--future-enhancements)

---

## Project Overview
This project is a client-side platform for soccer knowledge, designed to run entirely on GitHub Pages. It supports multiple quizzes, custom graphics, badges, and persistent user progress using browser `localStorage`.

---

## Project Structure
```
soccer-quizzes/
  index.html                  # Main Pro Hub dashboard
  video-clips.html            # Match Day video analysis hub
  /quizzes/
    index.html                # Quiz selection (Match Day selection)
    quiz.html                 # Match simulation template
    manifest.json             # List of all available quizzes
  /resources/
    index.html                # Playbook / Tactics landing
    formation.html            # Tactical whiteboard detail
  /assets/
    /graphics/                # Tactical diagrams
    /badges/                  # Earnable achievement badges
  /js/
    quiz.js                   # Quiz logic & data fetching
    quiz-ui.js                # Gamified UI & animations
    user.js                   # Progress & localStorage management
  style.css                   # Global Pro Hub styles (Tailwind + Custom)
  PROPOSALS.md                # Detailed roadmap & future plans
```

---

## Roadmap & Future Enhancements
We are constantly evolving the Pro Hub. For a detailed breakdown of upcoming features like the **"Training Ground" (Drills Library)** and **"Match Day Analysis" (Categorized Clips)**, please see:

👉 **[PROPOSALS.md](./PROPOSALS.md)**

---

## How to Add a New Quiz
1. Create a new JSON file in `/quizzes/` (e.g., `midfield.json`).
2. Add the metadata to `quizzes/manifest.json`.
3. The "Pro Hub" will automatically render the new quiz on the dashboard.

---

## Development Workflow
- **Static First:** All code and assets must be client-side compatible (GitHub Pages).
- **Styling:** Uses Tailwind CSS for rapid, responsive UI development.
- **State:** User progress is persistent via `localStorage`.

---

## Questions?
For any questions or contributions, open an issue or pull request on the repository.
