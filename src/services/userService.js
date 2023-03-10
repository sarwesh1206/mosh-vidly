import http from './httpService';
import aupiUrl from "../config.json"
const apiEndPoint = "http://localhost:3900/api/users";

export function register(user) {
    return http.post(apiEndPoint, {
        email: user.username,
        password: user.password,
        name: user.name
    })
}