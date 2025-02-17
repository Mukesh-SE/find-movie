const MovieCard = ({
	movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
	return (
		<div className="movie-card group relative overflow-hidden">
			<img
				src={
					poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"
				}
				className="relative z-10"
			/>
			<div className="absolute bottom-0 left-0 w-full h-1/4 ">
				<img
					src="/moviecard-info.svg"
					className="w-full h-full object-cover object-left-top mix-blend-overlay"
				/>
			</div>

			<div className="mt-4 relative z-10">
				<h3>{title}</h3>

				<div className="content ">
					<div className="rating">
						<img src="star.svg" alt="" />
						<p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
					</div>

					<span>.</span>

					<p className="lang">{original_language}</p>

					<span>.</span>

					<p className="year ">{release_date ? release_date.split("-")[0] : "N/A"}</p>
				</div>
			</div>
		</div>
	);
};

export default MovieCard;
