import PropTypes from "prop-types";

const RecommendationsList = ({ recommendations }) => {
  return (
    <div className="recommendations-list">
      <h2>Recommended Movies</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>
            <img src={rec.image_url} alt={rec.title} />
            <p>{rec.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

RecommendationsList.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecommendationsList;
