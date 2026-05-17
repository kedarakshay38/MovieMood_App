function MovieCard({ movie }) {
  return (
    <div className="bg-gray-800 rounded p-2">
      <img src={movie.Poster} alt={movie.Title} className="w-full rounded" />
      <h3 className="text-white mt-2 font-semibold">{movie.Title}</h3>
      <p className="text-gray-400 text-sm">{movie.Year}</p>
    </div>
  );
}

export default MovieCard;