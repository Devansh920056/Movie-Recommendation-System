import { useState, useEffect } from "react";
import axios from "axios";
import { create } from "zustand";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

const useMovieStore = create((set) => ({
  movies: [],
  setMovies: (movies) => set({ movies }),
  user: null,
  setUser: (user) => set({ user }),
  page: 1,
  setPage: (page) => set({ page }),
  totalPages: 1,
  setTotalPages: (totalPages) => set({ totalPages }),
}));

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = "https://api.themoviedb.org/3/search/movie";
const GENRE_API_URL = "https://api.themoviedb.org/3/genre/movie/list";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

const MovieRecommendationApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    movies,
    setMovies,
    user,
    setUser,
    page,
    setPage,
    totalPages,
    setTotalPages,
  } = useMovieStore();

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
              page: page,
            },
          });
          setMovies(response.data.results || []);
          setTotalPages(response.data.total_pages);
        } catch (error) {
          console.error("Error fetching movies:", error);
          toast.error("Failed to fetch movies. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      const debounceFetch = setTimeout(fetchMovies, 500);
      return () => clearTimeout(debounceFetch);
    } else if (!searchQuery) {
      setMovies([]);
    }
  }, [searchQuery, selectedGenre, setMovies, page, setTotalPages]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(GENRE_API_URL, {
          params: { api_key: API_KEY },
        });
        setGenres(response.data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        toast.error("Failed to fetch genres.");
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, [setUser]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Login successful!");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout failed.");
    }
  };

  const MovieCard = ({ movie }) => (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <img
        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{movie.title}</h2>
        <p className="text-sm text-gray-400 mb-2">
          Rating: {movie.vote_average}
        </p>
        <p className="text-sm text-gray-400">
          {movie.overview.substring(0, 100)}...
        </p>
      </div>
    </div>
  );
  MovieCard.propTypes = {
    movie: PropTypes.shape({
      poster_path: PropTypes.string,
      title: PropTypes.string.isRequired,
      vote_average: PropTypes.number,
      overview: PropTypes.string,
    }).isRequired,
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex justify-between items-center w-full max-w-5xl mb-6">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-300 text-transparent bg-clip-text animate-pulse">
          🎬 Movie Finder
        </h1>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-green-600 px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg"
          >
            Login
          </button>
        )}
      </div>

      <div className="flex gap-3 w-full max-w-4xl mb-4">
        <input
          type="text"
          placeholder="🔍 Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-5 py-3 rounded-lg bg-white/10 text-white backdrop-blur-md border border-white/20 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="px-5 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md">
              {" "}
              🎛 Filter{" "}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-gray-800 text-white p-2 rounded-lg shadow-lg space-y-1">
              <DropdownMenu.Item
                onClick={() => setSelectedGenre("")}
                className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded"
              >
                {" "}
                All Genres{" "}
              </DropdownMenu.Item>
              {genres.map((g) => (
                <DropdownMenu.Item
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded"
                >
                  {" "}
                  {g.name}{" "}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {loading && (
        <div className="mt-6 animate-spin text-pink-400 text-xl">
          {" "}
          🎞 Loading...{" "}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 w-full max-w-6xl">
        {movies.length > 0
          ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          : !loading && (
              <div className="col-span-full text-center text-gray-400 mt-12 text-lg">
                {" "}
                {searchQuery.length > 0
                  ? "😔 No results found. Try a different title!"
                  : "Start searching for movies!"}{" "}
              </div>
            )}
      </div>

      {movies.length > 0 && (
        <div className="flex mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-gray-700 px-3 py-1 rounded"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="bg-gray-700 px-3 py-1 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieRecommendationApp;
