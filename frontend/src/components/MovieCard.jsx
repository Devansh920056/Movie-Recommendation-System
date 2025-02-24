import PropTypes from "prop-types";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450"; // ✅ Placeholder for missing posters

  return (
    <div className="movie-card">
      <img
        src={posterUrl}
        alt={`${movie.title || "No Title"} poster`}
        className="movie-poster"
      />
      <div className="movie-details">
        <h2 className="movie-title">{movie.title || "Unknown Title"}</h2>
        <p className="movie-rating">⭐ {movie.vote_average || "N/A"} / 10</p>
        <p className="movie-description">
          {movie.overview || "No description available."}
        </p>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
    overview: PropTypes.string,
  }).isRequired,
};

export default MovieCard;
