import { useState } from "react";
import PropTypes from "prop-types";

const RecommendationForm = ({ onRecommend }) => {
  const [movie, setMovie] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRecommend(movie);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="movie">Enter a Movie Title:</label>
      <input
        type="text"
        id="movie"
        value={movie}
        onChange={(e) => setMovie(e.target.value)}
        placeholder="e.g., Avatar"
        required
      />
      <button type="submit">Get Recommendations</button>
    </form>
  );
};

RecommendationForm.propTypes = {
  onRecommend: PropTypes.func.isRequired,
};

export default RecommendationForm;
