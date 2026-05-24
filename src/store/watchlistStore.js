import { create } from "zustand";
import { persist } from "zustand/middleware";

// Custom middleware — logs state before and after every update
const logger = (config) => {
  return (set, get, api) => {
    const loggedSet = (args) => {
      console.log("previous state:", get());
      set(args);
      console.log("next state:", get());
    };
    return config(loggedSet, get, api);
  };
};

// Store definition
const storeConfig = (set) => {
  return {
    // STATE
    wantToWatch: [],
    watched: [],

    // ACTIONS
    addToWantToWatch: (movie) =>
      set((state) => {
        return { wantToWatch: [...state.wantToWatch, movie] };
      }),

    markAsWatched: (id) =>
      set((state) => {
        const movie = state.wantToWatch.find((m) => m.imdbID === id);
        if (!movie) return state;
        return {
          wantToWatch: state.wantToWatch.filter((m) => m.imdbID !== id),
          watched: [...state.watched, { ...movie, rating: 0 }],
        };
      }),
    rateMovie: (id, rating) =>
      set((state) => {
        return {
          watched: state.watched.map((m) =>
            m.imdbID === id ? { ...m, rating } : m,
          ),
        };
      }),

    removeMovie: (id, list) => {
      set((state) => {
        return { [list]: state[list].filter((m) => m.imdbID !== id) };
      });
    },
  };
};

// Create store with middlewares: logger → persist → storeConfig
export const useWatchlistStore = create(
  logger(persist(storeConfig, { name: "moviemood-watchlist" })),
);
