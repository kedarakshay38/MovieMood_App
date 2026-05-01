# MovieMood – Movie Discovery & Watchlist

## Overview
A mood-based movie discovery app with watchlists, ratings, and live search.
You'll learn core React + modern tooling (Zustand, Axios, Context, Tailwind, React Router, middlewares, controlled/uncontrolled components) by building something small but genuinely fun to use.

---

## What You'll Build

**Pages:**
- **Home** — pick a mood (Happy / Thrilled / Thoughtful / Romantic) → fetches matching movies
- **Search** — live debounced search bar
- **Movie Detail** — poster, plot, cast, ratings (dynamic route `/movie/:id`)
- **Watchlist** — two tabs: "Want to Watch" and "Watched" (persisted)
- **Stats** — count of watched, your top genre
- **Settings** — dark mode toggle, clear watchlist

**User flow example:**
1. Open app → pick "Thrilled" mood → see thriller movies
2. Click a movie → see details → add to "Want to Watch"
3. Later, mark it "Watched" → rate it 4/5 stars
4. Check Stats → see you've watched 12 movies, top genre: Sci-Fi

---

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- React Router v6+
- Axios (with interceptor middlewares)
- Zustand (with `persist` + custom `logger` middlewares)
- Context API (for theme only — Zustand handles the rest)
- OMDb API (free — get a key at https://www.omdbapi.com/apikey.aspx)

**Why two state tools?** This is intentional so you learn when to use each:
- **Context** → rarely-changing global values (theme) — simple, built-in
- **Zustand** → frequently-changing shared state (watchlist, search) — avoids re-render noise, has middleware

---

## Folder Structure

```
src/
 ├── app/            → App-level setup (providers)
 ├── components/     → Shared UI (Button, Modal, MovieCard, StarRating)
 ├── features/       → Feature-specific code
 │    ├── search/
 │    ├── movies/
 │    ├── watchlist/
 │    └── stats/
 ├── hooks/          → Custom hooks (useDebounce, useTheme)
 ├── services/       → Axios client + API functions (omdbApi.js)
 ├── store/          → Zustand stores (watchlistStore, searchStore)
 ├── context/        → React Context (ThemeContext only)
 ├── layouts/        → Page layout (Navbar + Outlet)
 ├── pages/          → Route-level pages (Home, Search, Detail, Watchlist, Stats, Settings)
 ├── routes/         → Route config (AppRoutes, ProtectedRoute if needed)
 ├── utils/          → Helpers (formatRuntime, moodToGenre)
 └── main.jsx
```

---

## Rules
- Keep components small — one job per component
- Follow folder structure strictly
- Separate logic (hooks/store/services) from UI (components/pages)
- Don't add a feature until the phase says so — learning is sequential
- Read every "What is…" explanation before coding the task

---

## Development Phases

Phases are sorted Easy → Medium → Hard. Each phase builds on the last.

---

### EASY PHASES (React basics + routing + Tailwind)

---

#### Phase 1: Project Setup + Placeholder Pages

**What you'll learn:**
- Vite project scaffolding
- Tailwind CSS installation and setup
- JSX — React's HTML-like syntax
- Components — functions that return JSX
- Export/import between files

**What is a Component?**
A JavaScript function that returns JSX. React renders whatever you return onto the screen.

**Tasks:**
1. Create the project:
   ```bash
   npm create vite@latest MovieMood -- --template react
   cd MovieMood
   npm install
   ```
2. Install Tailwind CSS (follow https://tailwindcss.com/docs/guides/vite)
3. Install React Router: `npm install react-router-dom`
4. Create the folder structure above (empty folders are fine for now)
5. Create placeholder pages in `src/pages/`:
   - `Home.jsx` → `<h1>Home</h1>`
   - `Search.jsx` → `<h1>Search</h1>`
   - `MovieDetail.jsx` → `<h1>Movie Detail</h1>`
   - `Watchlist.jsx` → `<h1>Watchlist</h1>`
   - `Stats.jsx` → `<h1>Stats</h1>`
   - `Settings.jsx` → `<h1>Settings</h1>`
6. Delete `src/App.css` — we use Tailwind now

**Example:**
```jsx
function Home() {
  return <h1 className="text-3xl font-bold">Home</h1>;
}
export default Home;
```

---

#### Phase 2: React Router Setup

**What you'll learn:**
- React Router — navigate between pages without full page reload
- `<BrowserRouter>`, `<Routes>`, `<Route>`
- Dynamic route params (`/movie/:id`)
- What an SPA (Single Page Application) is

**What is Routing?**
Normal websites load a new HTML page on every click. React routers swap components in and out without reloading — it's instant.

**Tasks:**
1. Create `src/routes/AppRoutes.jsx`:
   - Import `BrowserRouter`, `Routes`, `Route`
   - Map these routes:
     - `/` → Home
     - `/search` → Search
     - `/movie/:id` → MovieDetail
     - `/watchlist` → Watchlist
     - `/stats` → Stats
     - `/settings` → Settings
2. Update `src/App.jsx` — remove Vite boilerplate, render `<AppRoutes />`
3. Test: visit `/watchlist`, `/search`, etc. — the `<h1>` should change

---

#### Phase 3: Layout + Navbar

**What you'll learn:**
- Component composition
- `<Outlet />` — placeholder where child routes render
- Layouts — shared UI wrapper for multiple pages
- Tailwind utility classes (`flex`, `p-4`, `bg-slate-900`, etc.)
- `<Link>` vs `<a>` — Link navigates without reload

**What is a Layout?**
A wrapper component. It shows the navbar on every page, and `<Outlet />` renders the current page below it.

```
┌─────────────────────────────────┐
│   MovieMood  Home Watch Stats   │ ← Navbar
├─────────────────────────────────┤
│                                 │
│         <Outlet />              │ ← current page
│                                 │
└─────────────────────────────────┘
```

**Tasks:**
1. Create `src/components/Navbar.jsx`:
   - App name "MovieMood" on left
   - Nav links on right: Home, Search, Watchlist, Stats, Settings (use `<Link>`)
   - Style with Tailwind (flex, gap, padding, dark background)
2. Create `src/layouts/MainLayout.jsx`:
   - Render `<Navbar />` + `<Outlet />` inside a container div
3. Update `src/routes/AppRoutes.jsx`:
   - Wrap ALL routes inside `<MainLayout />` using nested routes
4. Test: navbar should appear on every page; clicking links should swap content

---

### MEDIUM PHASES (State + HTTP + real features)

---

#### Phase 4: Controlled Components + Search Page (no API yet)

**What you'll learn:**
- `useState` — storing data that changes over time
- **Controlled components** — input value driven by React state
- **Uncontrolled components** — input value held by the DOM (accessed via `useRef`)
- Event handlers (`onChange`, `onSubmit`)

**What is State?**
Data that changes. When state changes, React re-renders the component with the new value.

**Controlled vs Uncontrolled — the key difference:**
```jsx
// Controlled — React owns the value
const [query, setQuery] = useState("");
<input value={query} onChange={e => setQuery(e.target.value)} />

// Uncontrolled — the DOM owns the value, React reads it when needed
const inputRef = useRef(null);
<input ref={inputRef} defaultValue="" />
// later: inputRef.current.value
```
**Rule of thumb:** use controlled for most forms (easier validation, live updates). Use uncontrolled for fire-and-forget inputs (e.g. file upload, simple submit-only forms).

**Tasks:**
1. Update `src/pages/Search.jsx`:
   - A **controlled** search input (useState for query)
   - Show "Searching for: {query}" below as the user types
   - A submit button that logs the query for now
2. In the same Search page, add a second small form:
   - An **uncontrolled** input using `useRef`
   - On submit, read `inputRef.current.value` and alert it
   - This exists only so you see both patterns side by side — delete it after Phase 5 if you want
3. Style with Tailwind (input padding, focus ring, button hover)

---

#### Phase 5: HTTP Calls + Axios + Middlewares (Interceptors)

**What you'll learn:**
- **Axios** — HTTP client, cleaner than `fetch`
- **Middlewares (interceptors)** — code that runs on every request/response automatically
- Loading and error states
- Environment variables in Vite (`.env` + `import.meta.env`)
- Async/await

**What is Axios?**
A wrapper around HTTP calls with a nicer API and built-in JSON parsing. The killer feature is **interceptors** — functions that run on every request or response.

**What is a Middleware / Interceptor?**
A function that sits between your code and the network. Examples:
- Request interceptor: attach an API key to every request automatically
- Response interceptor: if the server returns a 401, redirect to login
You write the logic once, it runs on every request.

**Tasks:**
1. Get an OMDb API key (free): https://www.omdbapi.com/apikey.aspx
2. Create `.env` in project root:
   ```
   VITE_OMDB_API_KEY=your_key_here
   VITE_OMDB_BASE_URL=https://www.omdbapi.com
   ```
3. Install Axios: `npm install axios`
4. Create `src/services/apiClient.js`:
   - Create an Axios instance with `baseURL` from env
   - Add a **request interceptor** that appends `apikey` query param to every request
   - Add a **response interceptor** that logs errors and returns a friendly error message
5. Create `src/services/omdbApi.js`:
   - `searchMovies(query)` → `GET /?s=${query}`
   - `getMovieById(id)` → `GET /?i=${id}&plot=full`
6. Update `src/pages/Search.jsx`:
   - Add `useState` for `movies`, `loading`, `error`
   - On submit, call `searchMovies(query)`, handle all three states
   - Render a grid of movie cards (poster + title + year)
7. Create `src/components/MovieCard.jsx` — reusable card component
8. Show a loading spinner (just text "Loading…" is fine) and error message

---

#### Phase 6: Custom Hook — useDebounce + Live Search

**What you'll learn:**
- Custom hooks — extracting reusable logic
- `useEffect` — running code after render, with a cleanup function
- Debouncing — waiting for the user to stop typing before triggering an action

**What is useEffect?**
Code that runs AFTER React renders. Used for side effects (fetching, timers, subscriptions). The dependency array controls when it re-runs.

**What is Debouncing?**
Without debounce, typing "inception" fires 9 API calls. With debounce, you wait 400ms after the last keystroke and fire ONE call for "inception".

**Tasks:**
1. Create `src/hooks/useDebounce.js`:
   ```js
   import { useEffect, useState } from "react";
   export function useDebounce(value, delay = 400) {
     const [debounced, setDebounced] = useState(value);
     useEffect(() => {
       const id = setTimeout(() => setDebounced(value), delay);
       return () => clearTimeout(id);
     }, [value, delay]);
     return debounced;
   }
   ```
2. Update `src/pages/Search.jsx`:
   - Remove the submit button — search live
   - Use `useDebounce(query)` and `useEffect` to fetch whenever the debounced value changes
3. Test: type fast — only one API call fires after you stop

---

#### Phase 7: Movie Detail Page + useParams

**What you'll learn:**
- `useParams` — reading dynamic URL segments
- `useNavigate` — programmatic navigation (back button)
- Composing multiple small components

**Tasks:**
1. Update `src/pages/MovieDetail.jsx`:
   - Read `id` from `useParams()`
   - On mount (`useEffect`), call `getMovieById(id)`
   - Show poster, title, year, plot, ratings, cast, runtime
2. Add a back button using `useNavigate(-1)`
3. In `MovieCard.jsx`, wrap the card in `<Link to={`/movie/${movie.imdbID}`}>`
4. Test: click a card in Search → navigate to detail page → click back

---

#### Phase 8: Zustand Store + Watchlist + Middlewares

**What you'll learn:**
- **Zustand** — lightweight state management (no Provider needed!)
- **Zustand middlewares**: `persist` (localStorage) and custom `logger`
- Why Zustand beats Context for fast-changing shared state
- Selectors — subscribing to only the slice you need (no wasted re-renders)

**What is Zustand?**
A tiny state library. You create a store once, then any component can read/update it with a hook. Unlike Context, components only re-render when the piece they use changes.

**Zustand vs Context — when to use each:**
| Use Case | Pick |
|----------|------|
| Theme, locale, auth user (rarely changes) | Context |
| Watchlist, cart, search, UI state (changes often) | Zustand |
| Server data (fetched from API) | React Query (not used here, but worth knowing) |

**What is a Middleware (in Zustand)?**
A function that wraps your store to add behavior automatically. Example middlewares:
- `persist` — saves store to localStorage, restores on reload
- `devtools` — connects to Redux DevTools browser extension
- Custom `logger` — logs every state change to console

**Tasks:**
1. Install Zustand: `npm install zustand`
2. Create `src/store/watchlistStore.js`:
   ```js
   import { create } from "zustand";
   import { persist } from "zustand/middleware";

   // Custom logger middleware — logs every state change
   const logger = (config) => (set, get, api) =>
     config(
       (args) => {
         console.log("  applying", args);
         set(args);
         console.log("  new state", get());
       },
       get,
       api
     );

   export const useWatchlistStore = create(
     logger(
       persist(
         (set) => ({
           wantToWatch: [],
           watched: [],
           addToWantToWatch: (movie) =>
             set((s) => ({ wantToWatch: [...s.wantToWatch, movie] })),
           markAsWatched: (id) =>
             set((s) => {
               const movie = s.wantToWatch.find((m) => m.imdbID === id);
               if (!movie) return s;
               return {
                 wantToWatch: s.wantToWatch.filter((m) => m.imdbID !== id),
                 watched: [...s.watched, { ...movie, rating: 0 }],
               };
             }),
           rateMovie: (id, rating) =>
             set((s) => ({
               watched: s.watched.map((m) =>
                 m.imdbID === id ? { ...m, rating } : m
               ),
             })),
           removeMovie: (id, list) =>
             set((s) => ({ [list]: s[list].filter((m) => m.imdbID !== id) })),
         }),
         { name: "moviemood-watchlist" }
       )
     )
   );
   ```
3. On `MovieDetail` page, add an "Add to Watchlist" button that calls `addToWantToWatch`
4. Update `src/pages/Watchlist.jsx`:
   - Two tabs: "Want to Watch" and "Watched" (use local `useState` for active tab)
   - List movies from the store using selectors: `useWatchlistStore((s) => s.wantToWatch)`
   - Buttons: Mark Watched, Remove
5. Test: refresh browser — watchlist should persist! Open console — see logger output.

---

#### Phase 9: Home Page — Mood Picker

**What you'll learn:**
- Mapping abstract concepts (mood) to concrete API params (genre/keyword)
- Array mapping, conditional rendering
- Reusing the MovieCard component

**Tasks:**
1. Create `src/utils/moodToGenre.js`:
   ```js
   export const MOODS = {
     happy: ["comedy", "feel-good"],
     thrilled: ["thriller", "action"],
     thoughtful: ["drama", "documentary"],
     romantic: ["romance", "romcom"],
   };
   ```
   (OMDb doesn't filter by genre directly — use keywords as search terms, or hardcode a curated list per mood.)
2. Update `src/pages/Home.jsx`:
   - Render 4 big mood buttons
   - On click, set selected mood in local state, fetch movies, render in a grid
3. Add an `<AddToWatchlistButton />` on each card

---

#### Phase 10: Theme Context + Dark Mode

**What you'll learn:**
- `createContext`, `useContext`, Provider pattern
- Why Context is the right choice here (theme rarely changes, read by many components)
- Tailwind's `dark:` variant

**Why Context (not Zustand) for theme?**
Theme changes maybe once per session. Context is built-in, zero deps, and the re-render cost is negligible. Save Zustand for state that changes a lot.

**Tasks:**
1. Create `src/context/ThemeContext.jsx`:
   - `ThemeProvider` stores theme in state, syncs to `localStorage`, applies `dark` class to `<html>`
   - Exports `useTheme()` custom hook
2. Wrap app with `<ThemeProvider>` in `App.jsx`
3. In `Settings.jsx`, add a toggle button using `useTheme()`
4. In `tailwind.config.js`, set `darkMode: "class"`
5. Add `dark:` variants to Navbar, MovieCard, pages

---

### HARD PHASES (Polish + advanced patterns)

---

#### Phase 11: Star Rating + Stats Page

**What you'll learn:**
- Lifting state up
- `useMemo` — caching expensive calculations
- Derived state — compute, don't store

**What is useMemo?**
If you compute stats from 100 movies on every render, `useMemo` remembers the result and only recomputes when movies change.

**Tasks:**
1. Create `src/components/StarRating.jsx`:
   - Renders 5 clickable stars
   - Props: `value`, `onChange`
   - Click a star → call `onChange(newValue)`
2. On Watchlist "Watched" tab, wire up StarRating to `rateMovie(id, rating)` from the store
3. Update `src/pages/Stats.jsx`:
   - Use `useMemo` to compute:
     - Total watched count
     - Average rating
     - Top genre (count occurrences in `watched` array)
   - Display in 3 big stat cards
4. Optional: install `recharts` for a bar chart of ratings distribution

---

#### Phase 12: Polish — Loading Skeletons, Errors, Empty States

**What you'll learn:**
- Skeleton loaders (Tailwind `animate-pulse`)
- Empty state UI — what to show when a list is empty
- Error boundaries (optional — React class component or a library)

**Tasks:**
1. Create `src/components/SkeletonCard.jsx` — pulsing gray placeholder
2. Replace "Loading…" text in Search/Home with 8 SkeletonCards
3. Add empty states:
   - Empty watchlist → "No movies yet. Start exploring!"
   - Empty search → "No movies found for '{query}'"
4. Add hover/transition classes to all cards and buttons
5. Test on mobile viewport — make sure grid is responsive (`grid-cols-2 md:grid-cols-4`)

---

## Deliberate Learning Checkpoints

After each phase, you should be able to answer:

| Phase | Questions |
|-------|-----------|
| 1-2 | What is JSX? What's a component? What does React Router do? What is an SPA? |
| 3 | What is `<Outlet />`? How do nested routes work? Link vs anchor? |
| 4 | What's state? Controlled vs uncontrolled — when to use each? |
| 5 | What is Axios? What's a request interceptor? Why separate service layer? |
| 6 | What's a custom hook? Why debounce? Why does useEffect need cleanup? |
| 7 | What is `useParams`? When to use `useNavigate`? |
| 8 | What is Zustand? Why not use Context for everything? What's a middleware? Why persist in localStorage? |
| 9 | How to reuse components across pages? |
| 10 | What's Context for? Why use Context for theme but Zustand for watchlist? |
| 11 | What is useMemo? What is derived state? When to lift state up? |
| 12 | How to improve perceived performance? What's a skeleton loader? |

---

## Concept Coverage (what you asked to learn)

| Concept | Phase(s) |
|---------|----------|
| Zustand | 8 |
| Zustand middlewares (persist + custom logger) | 8 |
| HTTP calls (Axios) | 5 |
| Axios middlewares (interceptors) | 5 |
| useContext | 10 |
| Tailwind CSS | 1 onwards |
| React Router (basic + dynamic routes) | 2, 7 |
| Controlled components | 4, 5, 6 |
| Uncontrolled components (useRef) | 4 |

Bonus concepts picked up along the way: `useState`, `useEffect`, `useMemo`, `useRef`, `useNavigate`, `useParams`, custom hooks, debouncing, derived state, env vars, localStorage.

---

## Rules of Engagement (how we'll work)

- I'll guide you phase by phase — no jumping ahead
- I'll explain WHY before HOW for every concept
- I'll NOT write all the code for you — you'll code, I'll review and unblock
- If you get stuck, ask; I'll hint first, answer only if hint fails
- After each phase, we'll discuss the interview questions above before moving on

---

## Current Progress

- [ ] Phase 1: Project setup + placeholder pages
- [ ] Phase 2: React Router
- [ ] Phase 3: Layout + Navbar
- [ ] Phase 4: Controlled + Uncontrolled components
- [ ] Phase 5: Axios + Interceptors + Search API
- [ ] Phase 6: useDebounce + live search
- [ ] Phase 7: Movie Detail page
- [ ] Phase 8: Zustand + Watchlist + middlewares
- [ ] Phase 9: Home mood picker
- [ ] Phase 10: Theme Context + Dark Mode
- [ ] Phase 11: Star rating + Stats + useMemo
- [ ] Phase 12: Polish + empty states + skeletons
