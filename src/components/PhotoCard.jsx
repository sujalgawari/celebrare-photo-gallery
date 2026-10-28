export default function PhotoCard({ photo, isFavorite, onToggle }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={`https://picsum.photos/id/${photo.id}/600/400`}
        alt={`Photo by ${photo.author}`}
        className="h-56 w-full object-cover"
        loading="lazy"
      />

      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs text-gray-500">PHOTO BY</p>
          <h2 className="truncate font-semibold text-gray-800">
            {photo.author}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onToggle(photo.id)}
          aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={isFavorite}
          className="rounded-full p-2 text-2xl transition hover:bg-gray-100"
        >
          <span className={isFavorite ? 'text-red-500' : 'text-gray-400'}>
            {isFavorite ? '♥' : '♡'}
          </span>
        </button>
      </div>
    </article>
  )
}