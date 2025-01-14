import pandas as pd
import ast  # For parsing JSON-like strings

# Load the dataset
try:
    movies = pd.read_csv("data/tmdb_5000_movies.csv")
except FileNotFoundError:
    raise FileNotFoundError("The dataset 'tmdb_5000_movies.csv' was not found in the 'data/' directory.")

# Extract relevant columns
movies = movies[['title', 'genres', 'overview']]

# Parse the genres field
def parse_genres(genre_str):
    try:
        genres = ast.literal_eval(genre_str)  # Convert JSON-like string to a Python list
        return " ".join([genre['name'] for genre in genres])  # Join genre names with spaces
    except (ValueError, SyntaxError):
        return ""

movies['genres'] = movies['genres'].apply(parse_genres)

# Add a placeholder for image URLs
movies['image_url'] = "https://via.placeholder.com/150"  # Placeholder image for now

# Save the processed dataset
movies.to_csv("data/movies_with_images.csv", index=False)
print("Dataset processed and saved as 'movies_with_images.csv'!")
