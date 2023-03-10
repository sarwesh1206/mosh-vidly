import axios from 'axios';
import { toast } from 'react-toastify'
// import auth from './authService';

// axios.defaults.headers.common['x-auth-token'] = auth.getJwt();



//intercepting response for errors
axios.interceptors.response.use(null, err => {
    const expectedError = err.response && err.response.status >= 400 && err.response.status < 500;
    if (!expectedError) {
        console.log("logging the error", err);
        // alert('An unexpected error occurred');
        toast.error('An unexpected error occurred');

    }
    // console.log("interceptor called");
    return Promise.reject(err);
})

function setJwt(jwt) {
    axios.defaults.headers.common['x-auth-token'] = jwt;
}
export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    setJwt
}