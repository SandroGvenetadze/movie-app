import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchMovieById } from '@api/rapidapi'

interface Movie {
  id: string
  title: string
  image: string
  genre: string[]
  year: string
  rating: number
  description?: string
}

export default function Details() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMovie() {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMovieById(id)
        setMovie(data)
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

    loadMovie()
  }, [id])

  if (loading) return <p className="text-gray-400">Loading...</p>
  if (error) return <div className="bg-red-500 text-white p-3 rounded">{error}</div>

  if (!movie) return <p className="text-gray-400">No movie found.</p>

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img src={movie.image} alt={movie.title} className="w-64 mb-4" />
      <p className="text-gray-300">{movie.description}</p>
      <div className="mt-4">
        <span className="mr-4">Year: {movie.year}</span>
        <span>Rating: {movie.rating}</span>
      </div>
      <div className="mt-6">
        <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Back to list
        </Link>
      </div>
    </div>
  )
}
