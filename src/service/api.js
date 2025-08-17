import axios from 'axios';
import AuthService from './authService';

const api = axios.create({
  baseURL: 'http://localhost:8080/',
});
api.interceptors.request.use((config) => {
  const token = AuthService.getToken();
  console.log("the tokemn:", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// Add interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    debugger
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      // JWT expired or unauthorized
      // debugger
      try {
        debugger
        AuthService.removeToken();
        const refreshToken= AuthService.getRefrestToken();
        const res = await api.post("/auth/refresh", {
          refreshToken
        });
        /// Save new access token
        AuthService.setToken(res.data.accessToken)
        AuthService.setRefreshToken(res.data.refreshToken)
        AuthService.setId(res.data.id)

        // Update headers and retry
        originalRequest.headers["Authorization"] = "Bearer " + res.data.accessToken;
        debugger
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed → logout
        localStorage.removeItem("TOKEN_KEY");
        localStorage.removeItem("REFRESH_TOKEN_KEY");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
      // Or use navigate("/login") if in a React component
    }
    return Promise.reject(error);
  });

export default api;
