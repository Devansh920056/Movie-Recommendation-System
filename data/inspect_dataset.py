import pandas as pd

# Load the dataset
movies = pd.read_csv("tmdb_5000_movies.csv")

# Display the first few rows
print(movies.head())

# Display the column names
print(movies.columns)
