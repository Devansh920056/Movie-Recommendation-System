from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)
CORS(app)

# Load the cleaned dataset
try:
    movies = pd.read_csv("data/movies_with_images.csv")
except FileNotFoundError:
    raise FileNotFoundError("The dataset 'movies_with_images.csv' was not found in the 'data/' directory.")

# Combine genres and overview into a single feature for similarity calculations
movies['combined_features'] = (movies['genres'] + " " + movies['overview'].fillna("")).fillna("")

# Convert combined features into a matrix of token counts
vectorizer = CountVectorizer(stop_words='english')
feature_matrix = vectorizer.fit_transform(movies['combined_features'])

# Compute cosine similarity matrix
similarity_matrix = cosine_similarity(feature_matrix)

# Recommendation function
def recommend_movies(movie_title, top_n=5):
    try:
        # Find the index of the movie in the dataset
        movie_index = movies[movies['title'].str.lower() == movie_title.lower()].index[0]
    except IndexError:
        return {"error": f"Movie '{movie_title}' not found in the database."}

    # Compute similarity scores for the given movie
    similarity_scores = list(enumerate(similarity_matrix[movie_index]))
    sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    # Get the top N recommended movies (excluding the input movie)
    recommended_indices = [index for index, score in sorted_scores[1:top_n + 1]]
    recommendations = movies.iloc[recommended_indices][['title', 'image_url']].to_dict(orient='records')

    return {"movie": movie_title, "recommendations": recommendations}

# API endpoint for recommendations
@app.route('/recommend', methods=['GET'])
def recommend():
    # Get the movie title from the request
    movie_title = request.args.get('movie')
    if not movie_title:
        return jsonify({"error": "Please provide a movie title"}), 400

    # Get recommendations
    result = recommend_movies(movie_title)
    if "error" in result:
        return jsonify(result), 404

    return jsonify(result)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
