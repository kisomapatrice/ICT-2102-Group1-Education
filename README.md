# Group 1 Education — ICT 2102 Web Development

A professionally styled, responsive multi-page education website built with semantic HTML, CSS, and JavaScript. The visual system uses full-width photographic hero backgrounds with text overlays, a forest-green/ivory/gold palette, large display headings, generous spacing, and responsive layouts. The project brings learning areas, a weekly study timetable, educational photographs, admissions guidance, a fee calculator, registration form, feedback form, and trusted web-development resources into one consistent site.

## Pages

- `index.html` — Home and quick routes to key learning tasks
- `about.html` — Project purpose, team roles, audio, and video
- `programmes.html` — Nine learning areas with search and category filters
- `timetable.html` — Filterable weekly study timetable and planning checklist
- `gallery.html` — Six education photographs with category filters and image viewer
- `admissions.html` — Preparation guidance, checklist, and UGX fee calculator
- `student-registration.html` — Personal and academic fields, interests, study mode, password confirmation, and HTML5 validation
- `feedback.html` — Feedback form with rating and character counter
- `contact.html` — Educational references, group workflow, and contact guidance

## Project structure

```text
ICT-2102-Group1-Education/
├── index.html
├── about.html
├── programmes.html
├── timetable.html
├── gallery.html
├── admissions.html
├── student-registration.html
├── feedback.html
├── contact.html
├── README.md
├── TEAM_WORK_PLAN.md
├── TEST_CHECKLIST.md
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── images/README.md
    └── media/README.md
```

## Run locally

Open `index.html` in a modern browser. For a better development workflow, open this folder in VS Code and use Live Server if it is installed. All page links are relative, so the project can be hosted from a static web host such as GitHub Pages.

## Built-in interactions

The site includes responsive navigation, active-page navigation, programme search and filters, a day-filtered timetable, checklist controls, a filterable gallery with an accessible lightbox, a UGX fee calculator, text character counters, HTML form validation, password matching, and visible form status messages.

The registration and feedback forms validate required fields and save entries in the active browser profile with `localStorage`. Registration passwords are never saved. These browser-local records do not sync to another device or reach an institution. A future server/database feature can replace the storage adapter while keeping the same form interface; any live service should include server-side validation, access controls, secure password handling, privacy notices, and a defined retention policy.

## Content and photographs

The learning-area catalogue and weekly schedule are coursework content, not an official institution's catalogue or timetable. Confirm institution-specific details with an authorised source before presenting them as official facts. Homepage, feature-card, gallery, and individual page hero photographs use distinct Unsplash image URLs and require an internet connection. The design includes a graceful visual fallback if a remote image is unavailable.

## Team workflow

Use `TEAM_WORK_PLAN.md` to divide the work across the four group roles and `TEST_CHECKLIST.md` to test the pages before submitting or publishing them. Commit only after reviewing changed files and testing the site locally.
