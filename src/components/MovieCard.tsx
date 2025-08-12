
import { Link } from 'react-router-dom'
import { Movie } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export default function MovieCard({ movie }: { movie: Movie }) {
  const [favs, setFavs] = useLocalStorage<string[]>('movieapp:favs', [])
  const isFav = favs.includes(movie.id)

  function toggleFav() {
    setFavs(isFav ? favs.filter(id => id !== movie.id) : [...favs, movie.id])
  }

  return (
    <div className="card p-3 flex gap-3">
      <img
        src={movie.image}
        alt={movie.title}
        className="w-24 h-32 object-cover rounded-lg"
        loading="lazy"
        decoding="async"
      />
      <div className="flex-1">
        <Link to={`/movie/${movie.id}`} className="font-semibold hover:underline">
          {movie.title}
        </Link>
        {movie.year && <div className="text-sm text-muted">{movie.year}</div>}
        <div className="mt-2 flex gap-2 flex-wrap text-sm text-muted">
          {movie.genre?.slice(0,3).map((g) => (
            <span key={g} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{g}</span>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={toggleFav} className="btn-ghost">
            {isFav ? '★ Remove' : '☆ Favorite'}
          </button>
          <Link to={`/movie/${movie.id}`} className="btn-primary">Details</Link>
        </div>
      </div>
    </div>
  )
}
