Jungle-Cook

- Create, edit and share recipes.

## [Web 4 Link](https://in-info-web4.luddy.indianapolis.iu.edu/~vanrobbi/N315/book-nook/)

    -Firebase setup for use on remote

## Features

- Hash-based SPA routing (home, login, pages)
- Lightweight UI using jQuery for DOM updates
- SCSS-based styles with modular partials
- Firebase Authentication and Storage integration (client)

### Prerequisites

-Firebase auth setup for email/password

## Installation

1. Clone the repo

```bash
git clone https://github.com/vanrobbins/jungle-cook.git
cd jungle-cook
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

4. Optional: watch SCSS / compile

```bash
npm run compile:sass
```

## Project structure

- `index.html` — app shell
- `src/` — application code (routing, firebase wiring, models)
- `scss/` — style partials and `style.scss`
- `public/` — images and fonts
- `lib/` — third-party libs (jQuery)

## ENABLING Firebase (IMPORTANT)

- The client Firebase config (apiKey, projectId, etc.) is not secret. It will be bundled into your built JS. This is expected.
- You must edit the included `.env.example` to reflect your Firebase project's VITE\_ variables and create a local `.env.local` (ignored by git) from it. Example values in `.env.example` should be replaced with your project's values before building.

Example `.env.example` values (already present in repo, edit them):

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MSG_SENDER_ID
VITE_FIREBASE_APP_ID=1:...:web:...
```
