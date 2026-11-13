import axios from "axios";

// ApiClient (slide 018): used in Client Components, in the browser.
// The backend runs on port 4000, not 3000, because Next.js itself is on 300x.
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: true, // let the browser send the httpOnly cookie
});

// AuthContext fills these in (slide 016). This file cannot use the router
// itself, it is plain code that runs outside React.
let onUnauthenticated: () => void = () => {};
let onForbidden: () => void = () => {};

export function registerAuthHandlers(handlers: { unauthenticated: () => void; forbidden: () => void }) {
  onUnauthenticated = handlers.unauthenticated;
  onForbidden = handlers.forbidden;
}

const onAuthPage = () => window.location.pathname === "/login";

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    console.log("interceptor caught status", status);

    // 401: no token, or it expired. Log out and go to /login.
    if (status === 401 && !onAuthPage()) onUnauthenticated();
    // 403: logged in, but this user is not allowed to do this.
    if (status === 403) onForbidden();

    return Promise.reject(error);
  },
);

export default axiosInstance;
