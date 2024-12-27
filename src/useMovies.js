import { useEffect, useState } from "react";

const apiKey = "b56288fd";
export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	useEffect(() => {
		// callback?.();

		const controller = new AbortController();

		async function fetchData() {
			const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;
			try {
				setIsLoading(true);
				setError("");
				const response = await fetch(apiUrl, {
					signal: controller.signal,
				});
				if (!response.ok) {
					throw new Error(
						`HTTP error! status: ${response.status}`
					);
				}
				const data = await response.json();
				if (data.Response === "False") {
					throw new Error("Movie not found");
				}
				setMovies(data.Search);
				setError("");
			} catch (error) {
				if (error.name !== "AbortError") {
					setError(error.message);
					console.log(error.message);
				}
				setMovies([]);
			} finally {
				setIsLoading(false);
			}
		}
		if (query.length < 3) {
			setMovies([]);
			setError("");
			return;
		}
		// handleCloseMovie();
		fetchData();

		return function () {
			controller.abort();
		};
	}, [query]);

	return { movies, isLoading, error };
}
