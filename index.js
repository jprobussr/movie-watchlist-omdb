const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

const OMDB_API_KEY = 'YOUR_API_KEY_HERE';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const WATCHLIST_KEY = 'watchlist';

let lastResults = [];

const getWatchlist = () => {
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveWatchlist = (list) => {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
};

console.log('Watchlist from storage:', getWatchlist());

const addToWatchlist = (movie) => {
  const list = getWatchlist();

  const alreadySaved = list.some((item) => item.imdbID === movie.imdbID);
  if (alreadySaved) return false;

  list.push(movie);
  saveWatchlist(list);
  return true;
};

console.log('addToWatchlist ready');

const searchMovies = async (query) => {
  const safeQuery = encodeURIComponent(query);
  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${safeQuery}`;

  resultsContainer.textContent = 'Searching...';

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'True') {
      lastResults = data.Search;
      const moviesHtml = data.Search.map((movie) => {
        const poster =
          movie.Poster !== 'N/A' ? movie.Poster : 'assets/no-poster.png';

        return `
          <div class='movie-card' data-imdbid='${movie.imdbID}'>
            <img 
              class='card-poster'
              src='${poster}'
              alt='${movie.Title} poster'
              onerror="this.onerror=null; this.src='assets/no-poster.png';"
            />
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>
            <button class='watchlist-btn' type='button'>+ Watchlist</button>
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

resultsContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.watchlist-btn');
  if (!btn) return;

  const card = btn.closest('.movie-card');
  const imdbID = card?.dataset.imdbid;
  if (!imdbID) return;

  const movie = lastResults.find((m) => m.imdbID === imdbID);
  if (!movie) return;

  const movieToSave = {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Poster: movie.Poster,
  };

  const added = addToWatchlist(movieToSave);

  if (added) {
    btn.textContent = 'Saved';
    btn.disabled = true;
  }
});
