const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

const OMDB_API_KEY = 'a4345d16';

const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`,
    );

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();

    resultsContainer.innerHTML = '';

    if (data.Response === 'True') {
      data.Search.forEach((movie) => {
        resultsContainer.innerHTML += `
                    <div class='movie-card'>
                        <h2>${movie.Title}</h2>
                        <p>${movie.Year}</p>
                    </div>
                `;
      });
    } else {
      resultsContainer.innerHTML = `<p>${data.Error}</p>`;
    }
  } catch (error) {
    console.error('Error fetching movies:', err);
  }
};

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchValue = searchInput.value.trim();
    searchMovies(searchValue);
})
