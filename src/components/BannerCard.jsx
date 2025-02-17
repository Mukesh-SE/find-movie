import React from "react";

function BannerCard({ movie: { title, poster_path } }) {
	return (
		<div
			className={`movie-card p-0 banner-card w-[200px] h-[280px] bg-indigo-400 absolute left-1/2 top-1/2 -translate-1/2 shadow-2xl rounded-[30px] overflow-hidden -translate-x-1/2 grid justify-center items-center `}
		>
			<img
				src={poster_path ? `https:image.tmdb.org/t/p/w500/${poster_path}` : "no-movie.png"}
				className=" rounded-[26px]"
			/>
		</div>
	);
}

export default BannerCard;
