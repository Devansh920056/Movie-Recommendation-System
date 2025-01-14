import pandas as pd
import requests

# Load the dataset
movies = pd.read_csv("data/movies_with_images.csv")

# TMDB API configuration
API_KEY = "5d387077f3121d7248f2aec7a4130986"  # Replace with your TMDB API key
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"  # Standard poster size

# Function to fetch the poster URL
def get_movie_poster(title):
    try:
        # Search for the movie on TMDB
        response = requests.get(f"{BASE_URL}/search/movie", params={
            "api_key": API_KEY,
            "query": title
        })
        response_data = response.json()
        if response_data["results"]:
            # Get the first result's poster path
            poster_path = response_data["results"][0].get("poster_path", None)
            if poster_path:
                return f"{IMAGE_BASE_URL}{poster_path}"
        return "https://via.placeholder.com/150"  # Fallback placeholder
    except Exception as e:
        print(f"Error fetching poster for {title}: {e}")
        return "https://via.placeholder.com/150"

# Update the dataset with poster URLs
print("Fetching poster URLs...")
movies["image_url"] = movies["title"].apply(get_movie_poster)

# Save the updated dataset
movies.to_csv("data/movies_with_images.csv", index=False)
print("Dataset updated with poster URLs!")
