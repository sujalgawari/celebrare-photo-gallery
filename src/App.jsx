import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import useFetchPhotos from './hooks/useFetchPhotos'

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE':
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id]

    default:
      return state
  }
}

function getInitialFavorites() {
  try {
    const saved = JSON.parse(
      localStorage.getItem('celebrare-favorites') || '[]'
    )

    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function App() {
  const { photos, loading, error } = useFetchPhotos()
  const [search, setSearch] = useState('')

  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    undefined,
    getInitialFavorites
  )

  useEffect(() => {
    localStorage.setItem(
      'celebrare-favorites',
      JSON.stringify(favorites)
    )
  }, [favorites])

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  const handleToggleFavorite = useCallback((id) => {
    dispatch({ type: 'TOGGLE', id })
  }, [])

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.trim().toLowerCase())
    )
  }, [photos, search])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8 lg:px-12">
      <header className="mx-auto mb-10 max-w-7xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-violet-600">
          Celebrare Assignment
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Photo Gallery<span className="text-violet-600">.</span>
        </h1>

        <p className="mt-3 text-gray-600">
          Discover beautiful photos and save your favourites.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Search by author name..."
            aria-label="Search photos by author"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />

          <div className="flex shrink-0 items-center justify-center rounded-xl bg-violet-100 px-5 py-3 font-semibold text-violet-700">
            <span aria-hidden="true">♥</span>
            <span className="ml-2">{favorites.length} Favourites</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl">
        {loading && (
          <div className="flex flex-col items-center py-20" role="status">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="mt-4 text-gray-600">Loading photos...</p>
          </div>
        )}

        {!loading && error && (
          <div
            className="rounded-xl bg-red-50 p-6 text-center text-red-700"
            role="alert"
          >
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Please refresh the page and try again.
            </p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <p className="py-16 text-center text-gray-500">
            No photos found. Try another author name.
          </p>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                Explore Photos
              </h2>

              <span className="text-sm text-gray-500">
                {filteredPhotos.length} photos
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredPhotos.map((photo) => {
                const isFavorite = favorites.includes(photo.id)

                return (
                  <article
                    key={photo.id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <img
                      src={`https://picsum.photos/id/${photo.id}/600/400`}
                      alt={`Photo by ${photo.author}`}
                      className="h-56 w-full object-cover"
                      loading="lazy"
                    />

                    <div className="flex items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          PHOTO BY
                        </p>

                        <h3 className="truncate font-semibold text-gray-800">
                          {photo.author}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(photo.id)}
                        aria-label={
                          isFavorite
                            ? 'Remove from favourites'
                            : 'Add to favourites'
                        }
                        aria-pressed={isFavorite}
                        className="rounded-full p-2 text-2xl transition hover:bg-gray-100"
                      >
                        <span
                          className={
                            isFavorite
                              ? 'text-red-500'
                              : 'text-gray-400'
                          }
                        >
                          {isFavorite ? '♥' : '♡'}
                        </span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </>
        )}
      </section>

      <footer className="mx-auto mt-14 max-w-7xl border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        Built with React, Vite and Tailwind CSS
      </footer>
    </main>
  )
}