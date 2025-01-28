from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load preprocessed dataset
movies = pd.read_csv("data/movies_with_images.csv")

# TF-IDF Vectorizer to convert text to numerical format
vectorizer = TfidfVectorizer(stop_words="english")
movies["combined_features"] = movies["genres"].fillna("") + " " + movies["overview"].fillna("")
feature_matrix = vectorizer.fit_transform(movies["combined_features"])

# TMDB API for fetching posters
TMDB_API_KEY = "5d387077f3121d7248f2aec7a4130986"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

# Recommendation function
def recommend_movies(movie_title):
    if movie_title not in movies["title"].values:
        return {"error": "Movie not found!"}

    idx = movies[movies["title"] == movie_title].index[0]
    similarity_scores = cosine_similarity(feature_matrix[idx], feature_matrix).flatten()
    similar_movie_indices = np.argsort(similarity_scores)[::-1][1:6]  # Get top 5 similar movies

    recommendations = []
    for i in similar_movie_indices:
        title = movies.iloc[i]["title"]
        image_url = movies.iloc[i]["image_url"]
        genre = movies.iloc[i]["genres"]

        # Fetch real poster from TMDB if missing
        if image_url == "https://via.placeholder.com/150":
            image_url = fetch_movie_poster(title)

        recommendations.append({"title": title, "image_url": image_url, "genre": genre})

    return {"movie": movie_title, "recommendations": recommendations}

# Fetch real movie posters from TMDB API
def fetch_movie_poster(title):
    response = requests.get(f"https://api.themoviedb.org/3/search/movie", params={
        "api_key": TMDB_API_KEY,
        "query": title
    })
    data = response.json()
    if data["results"]:
        return f"{IMAGE_BASE_URL}{data['results'][0].get('poster_path', '')}"
    return "https://via.placeholder.com/150"

@app.route("/recommend", methods=["GET"])
def recommend():
    movie_title = request.args.get("movie", "")
    if not movie_title:
        return jsonify({"error": "Please provide a movie title"}), 400
    return jsonify(recommend_movies(movie_title))

if __name__ == "__main__":
    app.run(debug=True)