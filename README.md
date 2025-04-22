# Soccer Quizzes Platform

A scalable, static, and modular quiz platform designed for GitHub Pages. Built with software engineering best practices for maintainability, extensibility, and ease of collaboration.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [How to Add a New Quiz](#how-to-add-a-new-quiz)
- [Quiz Bank & Randomization](#quiz-bank--randomization)
- [User Progress & Badges](#user-progress--badges)
- [Customization & Extensibility](#customization--extensibility)
- [Development Workflow](#development-workflow)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

This project is a client-side quiz platform for soccer (football) knowledge, designed to run entirely on GitHub Pages. It supports multiple quizzes, custom graphics, badges, and persistent user progress using browser localStorage. The platform is highly modular and easy to extend.

---

## Project Structure

```
soccer-quizzes/
  index.html                  # Landing page (lists all quizzes, badges, user progress)
  /quizzes/
    quiz.html                 # Generic quiz template (loads quiz data dynamically)
    defense.json              # Defense quiz bank (15+ questions)
    passing-movement.json     # Passing & Movement quiz bank (15+ questions)
    shooting-finishing.json   # Shooting & Finishing quiz bank (15+ questions)
    soccer-field-awareness.json # Soccer Field Awareness quiz bank (15+ questions)
    attacking-with-purpose.json # Attacking with Purpose quiz bank (15+ questions)
    transitions.json          # Transitions (Attack ↔ Defense) quiz bank (15+ questions)
    manifest.json             # List of all available quizzes (metadata)
  /assets/
    /graphics/
      defense.svg             # (Placeholder: ⚽️)
      passing.svg             # (Placeholder: 🔄)
      shooting.svg            # (Placeholder: 🎯)
      soccer-field-awareness.svg # (Placeholder: 🗺️)
      attacking-with-purpose.svg # (Placeholder: 🔥)
      transitions.svg         # (Placeholder: 🔄)
      ...                     # More graphics per quiz
    /badges/
      defense-badge.svg       # (Placeholder: 🏅)
      passing-badge.svg       # (Placeholder: 🥈)
      shooting-badge.svg      # (Placeholder: 🥇)
      soccer-field-awareness-badge.svg # (Placeholder: 📍)
      attacking-with-purpose-badge.svg # (Placeholder: 🔝)
      transitions-badge.svg   # (Placeholder: 🔜)
      ...                     # More badges per quiz
    /animations/
      defense.json            # Animation data (or placeholder)
      passing.json            # Animation data (or placeholder)
      shooting.json           # Animation data (or placeholder)
      soccer-field-awareness.json # Animation data (or placeholder)
      attacking-with-purpose.json # Animation data (or placeholder)
      transitions.json        # Animation data (or placeholder)
      ...                     # More animation assets
  /js/
    quiz.js                   # Quiz logic (for quiz.html)
    landing.js                # Landing page logic
    user.js                   # User memory, badges, progress logic
  style.css                   # Common styles
  README.md                   # Project documentation
```

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
  - **Defense**
  - **Passing & Movement**
  - **Shooting & Finishing**
  - **Soccer Field Awareness**
  - **Attacking with Purpose**
  - **Transitions (Attack ↔ Defense)**
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
- **Badges:** Each quiz can specify a unique badge (emoji or SVG).
- **Animations:** Each quiz can specify a unique animation asset (JSON, Lottie, or placeholder).
- **Themes:** Each quiz can have its own color theme.
- **Question Banks:** Each quiz loads its own question set from its JSON file.
- **Future:** Easily add authentication, leaderboards, or shareable badges; the codebase is modular for future enhancements.

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
- **Accessibility:**
  - Design for keyboard navigation and screen readers.
- **Static-Only:**
  - All code and assets must be static and client-side (works on GitHub Pages).

---

## Future Enhancements
- SVG/PNG graphics and badges (replace emojis as assets become available)
- User authentication (optional, for cloud sync or leaderboards)
- Leaderboards (local or remote)
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
