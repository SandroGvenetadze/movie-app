import { useEffect, useState } from 'react'
import { fetchTopMovies } from '@api/rapidapi'
import MovieCard from '@components/MovieCard'

interface Movie {
  id: string
  title: string
  image: string
  genre: string[]
  year: string
  rating: number
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMovies() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchTopMovies()
        setMovies(data)
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

    loadMovies()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Top 100 Movies</h1>
      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <div className="bg-red-500 text-white p-3 rounded">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {!loading && !error && movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}
