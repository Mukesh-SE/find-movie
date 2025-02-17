import "./App.css";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import BannerCard from "./components/BannerCard";
import { getTrendingMovies, updateSearchCount } from "../appwrite";

// you find this same code on TMDB API reference page
const API_BASE_URL = `https://api.themoviedb.org/3`;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTION = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`,
	},
};

function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [movies, setMovies] = useState([]);
	const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
	const [trendingMovies, setTrendingMovies] = useState([]);
	const [bannerCard, setBannerCard] = useState([{ title: 1 }, { title: 2 }, { title: 3 }]);

	useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

	const fetchMovies = async (query = "") => {
		setIsLoading(true);
		setErrorMsg("");
		try {
			const endpoint = query
				? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
				: `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
			const response = await fetch(endpoint, API_OPTION);

			// ------------------------
			// banner card
			const bannerRsponse = await fetch(
				`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`,
				API_OPTION
			);
			const bannerData = await bannerRsponse.json();
			setBannerCard(bannerData.results.slice(0, 3));

			// ------------------------

			if (!response.ok) {
				throw new Error("Failed to fetch movies");
			}

			const data = await response.json();

			if (data.Response === "False") {
				setErrorMsg(data.Error || "Failed to fetch movies...");
				setMovies([]);
				return;
			}

			setMovies(data.results || []);

			if (query && data.results.length > 0) {
				await updateSearchCount(query, data.results[0]);
			}
		} catch (err) {
			// console.log(err);
			setErrorMsg(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchTrendingMovies = async () => {
		try {
			const movies = await getTrendingMovies();
			setTrendingMovies(movies);
		} catch (err) {
			console.log("Error fetching trending movies", err);
		}
	};

	useEffect(() => {
		fetchMovies(debounceSearchTerm);
	}, [debounceSearchTerm]);

	useEffect(() => {
		fetchTrendingMovies();

		const bannerWrapper = document.querySelector(".banner-wrapper");
		const interval = setInterval(() => {
			const firstCard = bannerWrapper.querySelector(".banner-card:first-child");
			if (firstCard) {
				bannerWrapper.append(firstCard);
			}
		}, 3000);

		return () => clearInterval(interval);
	}, []); // Add movies as dependency

	return (
		<main>
			<div className="pattern" />
			<div className="wrapper">
				<header>
					<div className="banner-wrapper  h-[300px]  relative mb-12">
						{bannerCard.map((movie, i) => {
							return <BannerCard key={i} movie={movie} />;
						})}
					</div>
					<h1 className="capitalize">
						Find <span className="text-gradient ">Movies</span> You&apos;ll Enjoy
						without Hassel
					</h1>
					<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</header>

				{trendingMovies.length > 0 && (
					<section className="trending">
						<h2>Tredning Movies</h2>
						<ul>
							{trendingMovies.map((movie, i) => (
								<li key={movie.$id}>
									<p>{i + 1}</p>
									<img src={movie.poster_url} alt={movie.title} />
								</li>
							))}
						</ul>
					</section>
				)}

				<section className="all-movies">
					<h2 className="">All Movies</h2>
					{isLoading ? (
						<Spinner />
					) : errorMsg ? (
						<p className="text-red-500">{errorMsg}</p>
					) : (
						<ul>
							{movies.map((movie, i) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</ul>
					)}
				</section>
			</div>
		</main>
	);
}

export default App;
