const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';
const IS_LOGGED_IN = 'isloggedin';

const AuthService = {
  login: (data) => {
    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_ID_KEY, data.id);
    localStorage.setItem(IS_LOGGED_IN, 'true');
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.setItem(IS_LOGGED_IN, 'false');
  },

  setToken: (token)=>localStorage.setItem(TOKEN_KEY,token),

  setRefreshToken: (refreshToken) =>localStorage.setItem(REFRESH_TOKEN_KEY,refreshToken),

  setId: (id)=> localStorage.setItem(USER_ID_KEY,id),

  removeToken: ()=>localStorage.removeItem(TOKEN_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),
  
  getRefrestToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  getUserId: () => localStorage.getItem(USER_ID_KEY),
  
  isLoggedIn: ()=> localStorage.getItem('isloggedin'),
  
  
};

export default AuthService;
