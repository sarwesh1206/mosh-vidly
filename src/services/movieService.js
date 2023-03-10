import http from "./httpService";
import apiUrl from '../config.json';
const apiEndPoint = 'http://localhost:3900/api/movies';

export function getMovies() {
    return http.get(apiEndPoint)
}

export function getMovie(movieId) {
    return http.get(apiEndPoint + '/' + movieId);
}
function getMovieUrl(id) {
    return `${apiEndPoint}/${id}`
}
export function saveMovie(movie) {
    if (movie._id) {
        const body = {
            ...movie
        }
        delete body._id;
        return http.put(apiEndPoint + '/' + movie._id, body);
    }
    return http.post(apiEndPoint, movie);
}
export function deleteMovie(movieId) {
    return http.delete(apiEndPoint + "/" + movieId);
}