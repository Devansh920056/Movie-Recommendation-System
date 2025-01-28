import PropTypes from "prop-types";
import "./MovieCard.css";

const MovieCard = ({ title, posterUrl, rating, description }) => {
  return (
    <div className="movie-card">
      <img src={posterUrl} alt={`${title} poster`} className="movie-poster" />
      <div className="movie-details">
        <h2 className="movie-title">{title}</h2>
        <p className="movie-rating">Rating: {rating}</p>
        <p className="movie-description">{description}</p>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  title: PropTypes.string.isRequired,
  posterUrl: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

export default MovieCard;
