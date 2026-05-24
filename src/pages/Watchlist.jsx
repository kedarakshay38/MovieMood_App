import { useState } from "react";
import { useWatchlistStore } from "../store/watchlistStore";

function Watchlist() {
  const wantToWatch = useWatchlistStore((state) => state.wantToWatch);
  const watched = useWatchlistStore((state) => state.watched);

  const markAsWatched = useWatchlistStore((state) => state.markAsWatched);

  const removeMovie = useWatchlistStore((state) => state.removeMovie);

  const [activeTab, setActiveTab] = useState("wantToWatch");

  const movies = activeTab === "wantToWatch" ? wantToWatch : watched;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Watchlist</h1>
      {/* Tabs */}
      <div className="text-3xl font-bold text-white mb-4">
        <button
          onClick={() => setActiveTab("wantToWatch")}
          className={`px-4 py-2 rounded ${activeTab === "wantToWatch" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          {" "}
          want to watch ({wantToWatch.length})
        </button>
        <button
          onClick={() => setActiveTab("watched")}
          className={`px-4 py-2 rounded ${activeTab === "watched" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          Watched ({watched.length})
        </button>
      </div>

      {movies.length === 0 ? (
          <p className="text-gray-400">No movies here yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="flex items-center gap-4 bg-gray-800 p-4 rounded">
                <img src={movie.Poster} alt={movie.Title} className="w-16 rounded" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{movie.Title}</h3>
                  <p className="text-gray-400 text-sm">{movie.Year}</p>
                </div>
                <div className="flex gap-2">
                  {activeTab === "wantToWatch" && (
                    <button
                      onClick={() => markAsWatched(movie.imdbID)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Mark Watched
                    </button>
                  )}
                  <button
                    onClick={() => removeMovie(movie.imdbID, activeTab)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

    </div>
  );
}

export default Watchlist;
