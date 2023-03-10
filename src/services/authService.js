import jwtDecode from 'jwt-decode';
import http from './httpService';
// import { apiUrl } from '../config.json';
const apiEndPoint = 'http://localhost:3900/api/auth';
const tokenKey = 'token';

http.setJwt(getJwt());

export async function login(email, password) {
    const { data: jwt } = await http.post(apiEndPoint, { email, password })
    localStorage.setItem('token', jwt)
    // return http.post(apiEndPoint, { email, password })
}

export function logout() {
    localStorage.removeItem(tokenKey);

}

export function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        return jwtDecode(jwt);
    }
    catch (error) {
        console.log("error", error);
        return null;

    }
}
export function loginWithJwt(jwt) {
    localStorage.setItem(tokenKey, jwt)
}
export function getJwt() {
    return localStorage.getItem(tokenKey);
}
export default {
    login,
    logout,
    getCurrentUser,
    loginWithJwt,
    getJwt
}