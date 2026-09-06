import '../css/Home.css'
import MovieCard from '../components/MovieCard'
import { useState, useEffect } from 'react'
import { searchMovies, getPopularMovies } from "../services/api"

function Home () {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null); //stores error
    const [loading, setLoading] = useState(true) //stores loading state

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            }
            finally {
                setLoading(false)
            }
        }

        loadPopularMovies()
    }, []);



    const handleSearch = async (e) => {
        e.preventDefault(); // Prevents the word inputted to be cleared when the page refreshes
        if (!searchQuery.trim()) return // Prevents empty searches
        if (loading) return // Prevents multiple searches while loading

        setLoading(true)
        try {
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
            setError(null)
        } catch (err) {
            console.log(err)
            setError("Failed to search movies...")  
        } finally{
            setLoading(false)
        }

       // setSearchQuery("") // Clear the search input after the search is submitted
    };

  return (
    <div className="home">

        <form onSubmit={handleSearch} className="search-form">
            <input type="text" 
            placeholder="Search for a movie..." 
            className="search-input" 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            <button type="submit" className="search-button">Search</button>
        </form>

        {error && <div className="error-message">{error}</div>}


        {loading? <div className="loading">Loading...</div> :
        (<div className="movies-grid">   
            {movies.map(movie => (
                <MovieCard movie={movie} key={movie.id} />
            )
            )}
         </div>)}

    </div>
  );
}

export default Home;