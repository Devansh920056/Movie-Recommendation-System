import pandas as pd
import requests

# Load dataset
movies = pd.read_csv("data/tmdb_5000_movies.csv")

# TMDB API details
API_KEY = "5d387077f3121d7248f2aec7a4130986"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

def get_movie_poster(title):
    response = requests.get(f"https://api.themoviedb.org/3/search/movie", params={
        "api_key": API_KEY,
        "query": title
    })
    data = response.json()
    if data["results"]:
        return f"{IMAGE_BASE_URL}{data['results'][0].get('poster_path', '')}"
    return "https://via.placeholder.com/150"

# Add image URLs
movies["image_url"] = movies["title"].apply(get_movie_poster)
movies.to_csv("data/movies_with_images.csv", index=False)

print("✅ Dataset updated with real poster URLs!")