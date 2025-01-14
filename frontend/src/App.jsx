import { useState } from "react";
import RecommendationForm from "./components/RecommendationForm";
import RecommendationsList from "./components/RecommendationsList";

const App = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const fetchRecommendations = async (movie) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/recommend?movie=${encodeURIComponent(movie)}`
      );
      const data = await response.json();
      if (response.ok) {
        setRecommendations(data.recommendations);
        setError("");
      } else {
        setError(data.error);
        setRecommendations([]);
      }
    } catch (err) {
      console.error("Error occurred while fetching recommendations:", err);
      setError("An error occurred while fetching recommendations.");
    }
  };

  return (
    <div className="app">
      <h1>Movie Recommendation System</h1>
      <RecommendationForm onRecommend={fetchRecommendations} />
      {error && <p className="error">{error}</p>}
      {recommendations.length > 0 && (
        <RecommendationsList recommendations={recommendations} />
      )}
    </div>
  );
};

export default App;
