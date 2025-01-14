import pandas as pd
from imdb import IMDb

# Initialize IMDb instance
ia = IMDb()

# Load the dataset
movies = pd.read_csv("data/movies_with_images.csv")

# Function to fetch poster URL from IMDb
def get_imdb_poster(movie_title):
    try:
        # Search for the movie
        search_results = ia.search_movie(movie_title)
        if search_results:
            # Get the first result and update details
            movie = search_results[0]
            ia.update(movie)
            return movie.get('full-size cover url', "https://via.placeholder.com/150")
        return "https://via.placeholder.com/150"  # Fallback if no result
    except Exception as e:
        print(f"Error fetching poster for {movie_title}: {e}")
        return "https://via.placeholder.com/150"

# Apply the function to fetch poster URLs
movies['image_url'] = movies['title'].apply(get_imdb_poster)

# Save the updated dataset
movies.to_csv("data/movies_with_images.csv", index=False)
print("Dataset updated with IMDb poster URLs!")
