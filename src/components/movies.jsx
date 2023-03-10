import React, { Component } from 'react';
import _ from 'lodash'
import SearchBox from './searchBox'
import { getMovies, deleteMovie } from '../services/movieService';
import MoviesTable from './moviesTable';
import Pagination from './common/pagination';
import ListGroup from './common/listGroup';
import { paginate } from '../utils/paginate'
// import { getGenres } from '../services/fakeGenreService'
import { getGenres } from '../services/genreService'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom';


class Movies extends React.Component {

    state = {
        movies: [],
        genres: [],
        pageSize: 4,
        currentPage: 1,
        searchQuery: "",
        selectedGenre: null,
        sortColumn: { path: 'title', order: 'asc' }
    }

    async componentDidMount() {
        console.log("mount:",);

        const { data } = await getGenres();
        console.log("dataGenres:", data);
        // const genres = [{ name: 'All Genres', _id: "" }, ...getGenres()]
        const genres = [{ name: 'All Genres', _id: "" }, ...data]
        const { data: movies } = await getMovies()
        console.log("res::", movies);
        // const genres = [{ name: 'All Genres', _id: "" }]
        console.log("movies:", movies);
        this.setState({ movies, genres })
    }

    handleDelete = async movie => {
        const originalMovies = this.state.movies;
        const movies = originalMovies.filter(m => m._id !== movie._id)
        this.setState({ movies: movies })
        try {
            await deleteMovie(movie._id);

        }
        catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error('This movie has already been deleted');
                this.setState({ movies: originalMovies })
            }
        }
    }
    handleLike = (movie) => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = { ...movies[index] };
        movies[index].liked = !movies[index].liked;
        this.setState({ movies });
    };
    handleGenreSelect = genre => {
        this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
    };

    handleSearch = query => {
        this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
    };

    handlePageChange = page => {
        this.setState({ currentPage: page })
    }

    handleSort = sortColumn => {
        this.setState({ sortColumn })
    }
    getPagedData = () => {
        const { pageSize, currentPage, movies: allMovies, selectedGenre, sortColumn,
            searchQuery,
        } = this.state;

        // const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies
        let filtered = allMovies;

        if (searchQuery)
            filtered = allMovies.filter(m =>
                m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
            );
        else if (selectedGenre && selectedGenre._id)
            filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const movies = paginate(sorted, currentPage, pageSize)
        return {
            totalCount: filtered.length,
            sorted,
            movies
        }
    }

    render() {
        const { length: count } = this.state.movies;
        const { user } = this.props;

        const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
        const { totalCount, movies } = this.getPagedData();
        if (count === 0) return <p>There are no movies in the database</p>

        // const filtered = selectedGenre && selectedGenre._id ? allMovies.filter(m => m.genre._id === selectedGenre._id) : allMovies

        // const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        // const movies = paginate(sorted, currentPage, pageSize)

        return (

            <div className=' row'>
                <div className='col-3'>
                    <ListGroup
                        items={this.state.genres}
                        selectedItem={this.state.selectedGenre}
                        onItemSelect={this.handleGenreSelect}></ListGroup>
                </div>
                <div className='col'>
                    {user && (
                        <Link to="movies/new"
                            className='btn btn-primary'
                            style={{ marginBottom: 20 }}
                        >
                        </Link>
                    )}
                    <p>There are {totalCount} movies in the database</p>
                    <SearchBox value={searchQuery} onChange={this.handleSearch} />
                    <MoviesTable
                        movies={movies}
                        sortColumn={sortColumn}
                        onLike={this.handleLike}
                        onDelete={this.handleDelete}
                        onSort={this.handleSort} />
                    <Pagination
                        itemsCount={totalCount}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={this.handlePageChange}
                    />
                </div>

            </div>



        )
    }
}

export default Movies; 