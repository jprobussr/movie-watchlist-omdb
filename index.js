const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

const OMDB_API_KEY = 'a4345d16';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const searchMovies = async (query) => {
  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${query}`;

  resultsContainer.innerHTML = 'Searching...';

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'True') {
      const moviesHtml = data.Search.map((movie) => {
        return `
          <div class='movie-card'>
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>
          </div>
        `;
      }).join('');
      
      resultsContainer.innerHTML = moviesHtml;

    } else {
      resultsContainer.innerHTML = `<p>${data.Error}</p>`;
    }

  } catch (error) {
    resultsContainer.innerHTML = `<p>Something went wrong.</p>`;
    console.error(error);
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchValue = searchInput.value.trim();

  if (!searchValue) return;

  searchMovies(searchValue);
});
