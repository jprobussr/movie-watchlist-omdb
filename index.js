const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

const OMDB_API_KEY = 'a4345d16';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const searchMovies = async (query) => {
  const safeQuery = encodeURIComponent(query);
  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${safeQuery}`;

  resultsContainer.textContent = 'Searching...';

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'True') {
      const moviesHtml = data.Search.map((movie) => {
        const poster =
          movie.Poster !== 'N/A' ? movie.Poster : 'assets/no-poster.png';

        return `
          <div class='movie-card'>
            <img 
              class='card-poster'
              src='${poster}'
              alt='${movie.Title} poster'
              onerror="this.onerror=null; this.src='assets/no-poster.png';"
            />
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>
          </div>
        `;
      }).join('');

      resultsContainer.innerHTML = moviesHtml;
    } else {
      resultsContainer.textContent = data.Error;
    }
  } catch (error) {
    console.error(error);
    resultsContainer.textContent = 'Something went wrong.';
  }
};

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchValue = searchInput.value.trim();

  if (!searchValue) return;

  searchMovies(searchValue);
});
