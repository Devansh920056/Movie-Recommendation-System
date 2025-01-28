import PropTypes from "prop-types";

const RecommendationsList = ({ recommendations }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
      {recommendations.map((movie, index) => (
        <div
          key={index}
          className="p-4 bg-white shadow-lg rounded-lg text-center"
        >
          <img
            src={movie.image_url || "https://via.placeholder.com/300x450"}
            alt={movie.title}
            className="w-full h-60 object-cover rounded-md"
          />
          <h3 className="mt-2 font-bold">{movie.title}</h3>
        </div>
      ))}
    </div>
  );
};

// ✅ Correct: PropTypes defined outside the component function
RecommendationsList.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      image_url: PropTypes.string,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// ✅ Correct: Only one export default
export default RecommendationsList;
