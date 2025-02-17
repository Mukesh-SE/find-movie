function Search({ searchTerm, setSearchTerm }) {
	return (
		<div className="search">
			<div className="">
				<img src="search.svg" alt="" />
				<input
					type="text"
					placeholder="search throug thousands of movies"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
		</div>
	);
}

export default Search;
