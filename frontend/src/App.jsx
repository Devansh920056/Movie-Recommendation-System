import { useState } from "react";
import RecommendationForm from "./components/RecommendationForm";
import RecommendationsList from "./components/RecommendationsList";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const MovieRecommendationApp = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = async (movie) => {
    if (!movie.trim()) {
      setError("Please enter a movie name!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/recommend?movie=${encodeURIComponent(movie)}`
      );
      const data = await response.json();

      if (data.recommendations) {
        setRecommendations(data.recommendations);
        setError("");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <RecommendationForm onRecommend={fetchRecommendations} />
      {isLoading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {recommendations.length > 0 && (
        <RecommendationsList recommendations={recommendations} />
      )}
    </div>
  );
};

export default MovieRecommendationApp;
