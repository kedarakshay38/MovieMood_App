import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
      <Link to={`/movie/${movie.imdbID}`}>
    <div className="bg-gray-800 rounded p-2">
      <img src={movie.Poster} alt={movie.Title} className="w-full rounded" />
      <h3 className="text-white mt-2 font-semibold">{movie.Title}</h3>
      <p className="text-gray-400 text-sm">{movie.Year}</p>
    </div>
    </Link>
  );
}

export default MovieCard;