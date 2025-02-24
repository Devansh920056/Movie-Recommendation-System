import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard"; // Ensure MovieCard exists
import { motion } from "framer-motion";
import axios from "axios";
import { create } from "zustand";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"; // Corrected import
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebaseConfig"; // Ensure firebaseConfig.js exists

// Zustand Store for Global State Management
const useMovieStore = create((set) => ({
  movies: [],
  setMovies: (movies) => set({ movies }),
  user: null,
  setUser: (user) => set({ user }),
}));

// TMDB API Configuration
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Now safely stored in .env
const API_URL = "https://api.themoviedb.org/3/search/movie";
const GENRE_API_URL = "https://api.themoviedb.org/3/genre/movie/list";

const MovieRecommendationApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(false);

  const { movies, setMovies, user, setUser } = useMovieStore();

  // Fetch Movies with optional genre filtering
  useEffect(() => {
    if (searchQuery.length > 2) {
      setLoading(true);
      const fetchMovies = async () => {
        try {
          const response = await axios.get(API_URL, {
            params: {
              query: searchQuery,
              api_key: API_KEY,
              with_genres: selectedGenre || "",
            },
          });

          console.log("API Response:", response.data.results); // Debugging

          setMovies(response.data.results || []);
        } catch (error) {
          console.error("Error fetching movies:", error);
        } finally {
          setLoading(false);
        }
      };

      const debounceFetch = setTimeout(fetchMovies, 500);
      return () => clearTimeout(debounceFetch);
    }
  }, [searchQuery, selectedGenre, setMovies]);

  // Fetch Genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(GENRE_API_URL, {
          params: { api_key: API_KEY },
        });

        console.log("Genres:", response.data.genres); // Debugging

        setGenres(response.data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Firebase Authentication State
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, [setUser]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between w-full max-w-lg mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🎬 Movie Recommendation App
        </h1>
        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Login
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 w-full max-w-lg">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg text-black"
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Filter
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-gray-800 text-white p-2 rounded shadow-lg">
              <DropdownMenu.Item onClick={() => setSelectedGenre("")}>
                All Genres
              </DropdownMenu.Item>
              {genres.map((g) => (
                <DropdownMenu.Item
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className="hover:bg-gray-700 cursor-pointer p-1"
                >
                  {g.name}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Loading Spinner */}
      {loading && <p className="text-white mt-4">Loading...</p>}

      {/* Movie Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="text-gray-400">No movies found. Try another search!</p>
        )}
      </motion.div>
    </div>
  );
};

export default MovieRecommendationApp;
