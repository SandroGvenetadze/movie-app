import { useAuth } from '@context/AuthContext'
import MovieCard from '@components/MovieCard'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import { fetchMovieById } from '@api/rapidapi'

interface Movie {
  id: string
  title: string
  image: string
  genre: string[]
  year: string
  rating: number
}

export default function Favorites() {
  const { user } = useAuth()
  const [favoriteIds] = useLocalStorage<string[]>(`favorites_${user?.email}`, [])
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFavorites() {
      if (!favoriteIds.length) return
      setLoading(true)
      setError(null)
      try {
        const moviesData: Movie[] = []
        for (const id of favoriteIds) {
          const movie = await fetchMovieById(id)
          moviesData.push(movie)
        }
        setFavorites(moviesData)
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 429) {
            setError('API Limit Exceeded – Try again later')
          } else if (err.response.status === 400) {
            setError('Bad Request – Please check your request parameters')
          } else {
            setError(`Error: ${err.response.statusText || 'Unknown error'}`)
          }
        } else {
          setError('Network Error – Please check your internet connection')
        }
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [favoriteIds])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <div className="bg-red-500 text-white p-3 rounded">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {!loading && !error && favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}
