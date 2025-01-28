import { useState } from "react";
import PropTypes from "prop-types";

const RecommendationForm = ({ onRecommend }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      alert("Please enter a movie name!");
      return;
    }
    onRecommend(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 justify-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a movie..."
        className="p-2 border rounded"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Get Recommendations
      </button>
    </form>
  );
};

// ✅ Correct: Only one default export
RecommendationForm.propTypes = {
  onRecommend: PropTypes.func.isRequired,
};

export default RecommendationForm;
