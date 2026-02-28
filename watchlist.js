const watchlistContainer = document.getElementById('watchlist');
const WATCHLIST_KEY = 'watchlist';

const getWatchlist = () => {
  const stored = localStorage.getItem(WATCHLIST_KEY);
  return stored ? JSON.parse(stored) : [];
};

const watchlist = getWatchlist();
console.log('Watchlist:', watchlist);

const saveWatchlist = list => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
};

const removeFromWatchlist = imdbID => {
    const list = getWatchlist();
    const updated = list.filter((movie) => movie.imdbID !== imdbID);
    saveWatchlist(updated);
    return updated;
}

const renderWatchList = (movies) => {
  if (movies.length === 0) {
    watchlistContainer.innerHTML = `<p>No movies saved yet.</p>`;
    return;
  }

  const html = movies
    .map((movie) => {
      const poster =
        movie.Poster && movie.Poster !== 'N/A'
          ? movie.Poster
          : 'assets/no-poster.png';

      return `
        <div class='movie-card' data-imdbid='${movie.imdbID}'>
            <img 
                src='${poster}'
                alt='${movie.Title} poster'
                onerror="this.onerror=null; this.src='assets/no-poster.png';"
            />
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>
            <button class='remove-btn' type='button'>Remove</button>
        </div>
    `;
    })
    .join('');

  watchlistContainer.innerHTML = html;
};

watchlistContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-btn');
    if (!btn) return;

    const card = btn.closest('.movie-card');
    const imdbID = card?.dataset.imdbid;
    if (!imdbID) return;

    const updatedList = removeFromWatchlist(imdbID);
    renderWatchList(updatedList);
})

renderWatchList(watchlist);
