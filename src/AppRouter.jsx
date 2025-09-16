// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './login/signup';
import Signin from './login/signin';
import Reviews from './Home/reviews';
import ContentReview from './Home/ContentReview';
import Layout from './navbar/Layout';
import SearchResults from './navbar/SearchResults';
import SignOut from './login/signout';
import Profile from './Home/profile';
import About from './navbar/About';
import SearchSelected from './pages/SearchSelected';
import Home from './Home/indexpage';
import { NotificationProvider } from './service/notificationprovider';
import PowerSearch from './pages/powersearch';

function AppRouter() {
  return (
    <NotificationProvider> {/* ✅ Wrap everything here */}
      <BrowserRouter>
        <Routes>
          {/* Layout wrapper */}
          <Route path="/" element={<Layout />}>
            {/* Default home page */}
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="signup" element={<Signup />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signout" element={<SignOut />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="review/:id" element={<ContentReview />} />
            <Route path="content/:id" element={<SearchSelected />} />
            <Route path="search/:id" element={<SearchSelected />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="myProfile" element={<Profile />} />
            <Route path="powersearch" element={<PowerSearch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default AppRouter;
