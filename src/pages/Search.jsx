import { useState, useRef, useEffect } from "react";
import { searchMovies } from "../services/omdbApi";
import MovieCard from "../components/MovieCard";
import { useDebounce } from "../hooks/useDebounce";
function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    if (!debouncedQuery) {
      setMovies([]);
      return;
    }
    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMovies(debouncedQuery);
        if (data.Response === "False") {
          setError(data.Error); // e.g., "Movie not found!"
        } else {
          setMovies(data.Search);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
     fetchMovies();
  }, [debouncedQuery]);

  const inputRef = useRef(null);
  function handleReport() {
    alert(inputRef.current.value);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Search</h1>
      <input
        className="px-4 py-2 m-2  rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="search for movie"
      />

      <p>Searching for {query}</p>

      <input
        className="px-4 m-2 py-2   rounded border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        ref={inputRef}
        placeholder="Describe the issue"
      />

      <button
        className="px-4 m-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleReport}
      >
        Submit Report
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {movies.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
