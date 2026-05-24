import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "../services/omdbApi";
import { useWatchlistStore } from "../store/watchlistStore";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addToWantToWatch=useWatchlistStore((state)=>state.addToWantToWatch )

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);

      try {
        const data = await getMovieById(id);
        if (data.Response === "False") {
          setError(data.Error);
        } else {
          setMovie(data);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!movie) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        ← Back
      </button>

      <button
        onClick={() => addToWantToWatch(movie)}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Add to Watchlist
      </button>

      <div className="flex gap-6">
        <img src={movie.Poster} alt={movie.Title} className="w-48 rounded" />
        <div>
          <h1 className="text-3xl font-bold text-white">{movie.Title}</h1>
          <p className="text-gray-400">
            {movie.Year} · {movie.Runtime}
          </p>
          <p className="text-gray-300 mt-4">{movie.Plot}</p>
          <p className="text-gray-400 mt-2">
            <span className="text-white">Cast:</span> {movie.Actors}
          </p>

          <div className="mt-4">
            {movie.Ratings.map((r) => (
              <p key={r.Source} className="text-gray-400 text-sm">
                {r.Source}: {r.Value}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
