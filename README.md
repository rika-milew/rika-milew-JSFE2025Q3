# Async Race

Drag-racing SPA built with vanilla TypeScript. Manage cars, run races, and view winner statistics.

⚠️ **Note:** This app requires the [mock server](https://github.com/mikhama/async-race-api) to be running locally or the live demo won't function.

## Features
- 🚗 Garage view: CRUD for cars, color picker, generate 100 random cars
- 🏁 Race: start/stop individual engines or race all cars on page
- 🏆 Winners view: sortable table with wins and best times
- 💾 Persistent state between views
- 📱 Responsive down to 500px

## Tech Stack
- TypeScript (strict, no `any`)
- Vite
- CSS Animations
- ESLint (Airbnb config)
- Fetch API

## Setup
1. Clone the server mock: `git clone https://github.com/mikhama/async-race-api.git`
2. Install and run server: `npm install && npm start`
3. Clone this repo: `git clone https://github.com/rika-milew/async-race.git`
4. Install and run: `npm install && npm run dev`
5. Open `http://localhost:5173`

## Demo
[Live demo](https://rolling-scopes-school.github.io/rika-milew-JSFE2025Q3/async-race/)
